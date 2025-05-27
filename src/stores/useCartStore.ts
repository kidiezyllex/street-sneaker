import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
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
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

const calculateTotals = (items: CartItem[]) => {
  // Tạm tính: Tổng giá trị các sản phẩm (đã áp dụng khuyến mãi)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Thuế VAT 10% (theo luật Việt Nam)
  const tax = subtotal * 0.1;
  
  // Phí vận chuyển: Miễn phí nếu đơn hàng trên 500,000 VND, ngược lại 30,000 VND
  const shipping = subtotal >= 500000 ? 0 : 30000;
  
  // Tổng cộng
  const total = subtotal + tax + shipping;
  
  console.log('🧮 calculateTotals Debug:', {
    itemsCount: items.length,
    itemsPrices: items.map(item => ({ name: item.name, price: item.price, quantity: item.quantity, total: item.price * item.quantity })),
    subtotal,
    tax,
    shipping,
    total
  });
  
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
            discountPercent: product.discountPercent || 0,
            hasDiscount: Boolean(product.hasDiscount || (product.originalPrice && product.originalPrice > product.price)),
            image: product.image,
            quantity: quantity,
            slug: product.slug,
            brand: product.brand,
            colors: product.colors,
            size: product.size,
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