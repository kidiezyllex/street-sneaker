import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  hasDiscount?: boolean;
  image: string;
  quantity: number;
  slug: string;
  brand: string;
  colors?: string[];
  size?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
};

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      
      addToCart: (product, quantity) => {
        const currentItems = [...get().items];
        const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
          currentItems[existingItemIndex].quantity += quantity;
        } else {
          currentItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            discountPercent: product.discountPercent,
            hasDiscount: product.hasDiscount,
            image: product.image,
            quantity: quantity,
            slug: product.slug,
            brand: product.brand,
            colors: product.colors,
            size: product.size
          });
        }
        
        const { totalItems, totalPrice } = calculateCartTotals(currentItems);
        const { subtotal, tax, shipping, total } = calculateTotals(currentItems);
        
        set({ 
          items: currentItems,
          totalItems,
          totalPrice,
          subtotal,
          tax,
          shipping,
          total
        });
      },
      
      removeFromCart: (productId) => {
        const currentItems = get().items.filter(item => item.id !== productId);
        const { totalItems, totalPrice } = calculateCartTotals(currentItems);
        const { subtotal, tax, shipping, total } = calculateTotals(currentItems);
        
        set({ 
          items: currentItems,
          totalItems,
          totalPrice,
          subtotal,
          tax,
          shipping,
          total
        });
      },
      
      updateQuantity: (productId, quantity) => {
        const currentItems = [...get().items];
        const itemIndex = currentItems.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
          currentItems[itemIndex].quantity = quantity;
          
          const { totalItems, totalPrice } = calculateCartTotals(currentItems);
          const { subtotal, tax, shipping, total } = calculateTotals(currentItems);
          
          set({ 
            items: currentItems,
            totalItems,
            totalPrice,
            subtotal,
            tax,
            shipping,
            total
          });
        }
      },
      
      clearCart: () => {
        set({ 
          items: [],
          totalItems: 0,
          totalPrice: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        });
      }
    }),
    {
      name: 'cart-storage',
    }
  )
); 