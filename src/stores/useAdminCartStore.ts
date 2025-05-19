import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AdminCartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  colorName: string;
  colorCode?: string;
  sizeName: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  actualColorId?: string;
  actualSizeId?: string;
}

interface AppliedVoucher {
  _id: string;
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  quantity: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  minOrderValue: number;
  status: string;
  maxValue?: number;
}

interface AdminCartState {
  items: AdminCartItem[];
  appliedVoucher: AppliedVoucher | null;
  appliedDiscount: number;
  couponCode: string;
  
  addToCart: (item: AdminCartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyVoucher: (voucher: AppliedVoucher) => void;
    removeVoucher: () => void;
    setCouponCode: (code: string) => void; 
  calculateSubtotal: () => number;
  calculateDiscount: () => number;
  calculateTotal: () => number;
}

const calculateSubtotal = (items: AdminCartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateDiscount = (items: AdminCartItem[], voucher: AppliedVoucher | null): number => {
  if (!voucher) return 0;

  const subtotal = calculateSubtotal(items);

  if (subtotal < voucher.minOrderValue) {
    return 0;
  }

  let discountAmount = 0;
  if (voucher.type === 'PERCENTAGE') {
    discountAmount = (subtotal * voucher.value) / 100;
    if (voucher.maxValue && discountAmount > voucher.maxValue) {
      discountAmount = voucher.maxValue;
    }
  } else if (voucher.type === 'FIXED_AMOUNT') {
    discountAmount = voucher.value;
  }

  return Math.min(discountAmount, subtotal);
};


export const useAdminCartStore = create(
  persist<AdminCartState>(
    (set, get) => ({
      items: [],
      appliedVoucher: null,
      appliedDiscount: 0,
      couponCode: '',

      setCouponCode: (code) => set({ couponCode: code }),

      addToCart: (newItem) => {
        const currentItems = [...get().items];
        const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id);

        if (existingItemIndex !== -1) {
          if (currentItems[existingItemIndex].quantity + newItem.quantity <= newItem.stock) {
             currentItems[existingItemIndex].quantity += newItem.quantity;
          } else {
             console.warn(`Cannot add more. Stock limit reached for item ${newItem.name}`);
             return;
          }
        } else {
           if (newItem.quantity > newItem.stock) {
               console.warn(`Cannot add item. Stock limit for item ${newItem.name} is ${newItem.stock}`);
               return;
           }
          currentItems.push(newItem);
        }

        const voucher = get().appliedVoucher;
        const newDiscount = calculateDiscount(currentItems, voucher);

        set({
          items: currentItems,
          appliedDiscount: newDiscount,
        });

        if (voucher && newDiscount === 0 && calculateSubtotal(currentItems) > 0) {
             set({ appliedVoucher: null, couponCode: '' });
        }
      },

      removeFromCart: (itemId) => {
        const updatedItems = get().items.filter(item => item.id !== itemId);
        const voucher = get().appliedVoucher;
        const newDiscount = calculateDiscount(updatedItems, voucher);

        set({
          items: updatedItems,
          appliedDiscount: newDiscount,
        });

         if (voucher && newDiscount === 0 && updatedItems.length > 0) {
             set({ appliedVoucher: null, couponCode: '' });
         } else if (voucher && updatedItems.length === 0) {
              set({ appliedVoucher: null, appliedDiscount: 0, couponCode: '' });
         }

      },

      updateQuantity: (itemId, quantity) => {
        const currentItems = [...get().items];
        const itemIndex = currentItems.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
           const effectiveQuantity = Math.max(0, quantity);
           if (effectiveQuantity > currentItems[itemIndex].stock) {
                console.warn(`Cannot update quantity. Stock limit for item ${currentItems[itemIndex].name} is ${currentItems[itemIndex].stock}`);
                currentItems[itemIndex].quantity = currentItems[itemIndex].stock;
           } else {
               currentItems[itemIndex].quantity = effectiveQuantity;
           }

          const updatedItems = currentItems.filter(item => item.quantity > 0);

          const voucher = get().appliedVoucher;
          const newDiscount = calculateDiscount(updatedItems, voucher);

          set({
            items: updatedItems,
            appliedDiscount: newDiscount,
          });

           if (voucher && newDiscount === 0 && updatedItems.length > 0) {
               set({ appliedVoucher: null, couponCode: '' });
           } else if (voucher && updatedItems.length === 0) {
                set({ appliedVoucher: null, appliedDiscount: 0, couponCode: '' });
           }
        }
      },

      clearCart: () => {
        set({
          items: [],
          appliedVoucher: null,
          appliedDiscount: 0,
          couponCode: '',
        });
      },

      applyVoucher: (voucher) => {
         const currentItems = get().items;
         const subtotal = calculateSubtotal(currentItems);
         if (subtotal < voucher.minOrderValue) {
             set({ appliedVoucher: null, appliedDiscount: 0, couponCode: '' });
             return;
         }

         const discountAmount = calculateDiscount(currentItems, voucher);

         set({
             appliedVoucher: voucher,
             appliedDiscount: discountAmount,
             couponCode: voucher.code,
         });
      },

      removeVoucher: () => {
         set({
             appliedVoucher: null,
             appliedDiscount: 0,
             couponCode: '',
         });
      },

      // Helper functions exposed via the store
      calculateSubtotal: () => calculateSubtotal(get().items),
      calculateDiscount: () => get().appliedDiscount, // Discount is already calculated and stored
      calculateTotal: () => get().calculateSubtotal() - get().calculateDiscount(),

    }),
    {
      name: 'admin-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: AdminCartState): Partial<AdminCartState> => ({
          items: state.items,
          appliedVoucher: state.appliedVoucher,
          appliedDiscount: state.appliedDiscount,
      }),
  
    }
  )
); 