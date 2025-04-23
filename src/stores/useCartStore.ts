import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
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
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

// Helper để tính các giá trị tổng
const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      
      addToCart: (product, quantity) => {
        const currentItems = [...get().items];
        const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
          // Nếu sản phẩm đã tồn tại, cập nhật số lượng
          currentItems[existingItemIndex].quantity += quantity;
        } else {
          // Thêm sản phẩm mới vào giỏ hàng
          currentItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            quantity: quantity,
            slug: product.slug,
            brand: product.brand,
            colors: product.colors,
            size: product.size
          });
        }
        
        const { totalItems, totalPrice } = calculateCartTotals(currentItems);
        
        set({ 
          items: currentItems,
          totalItems,
          totalPrice
        });
      },
      
      removeFromCart: (productId) => {
        const currentItems = get().items.filter(item => item.id !== productId);
        const { totalItems, totalPrice } = calculateCartTotals(currentItems);
        
        set({ 
          items: currentItems,
          totalItems,
          totalPrice
        });
      },
      
      updateQuantity: (productId, quantity) => {
        const currentItems = [...get().items];
        const itemIndex = currentItems.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
          // Cập nhật số lượng cho sản phẩm
          currentItems[itemIndex].quantity = quantity;
          
          const { totalItems, totalPrice } = calculateCartTotals(currentItems);
          
          set({ 
            items: currentItems,
            totalItems,
            totalPrice
          });
        }
      },
      
      clearCart: () => {
        set({ 
          items: [],
          totalItems: 0,
          totalPrice: 0
        });
      }
    }),
    {
      name: 'cart-storage', // Tên định danh cho localStorage
    }
  )
); 