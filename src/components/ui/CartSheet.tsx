import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartStore } from '@/stores/useCartStore';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/services/order';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSheet: React.FC<CartSheetProps> = ({ open, onOpenChange }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { 
    items, 
    subtotal, 
    tax, 
    shipping, 
    total, 
    removeFromCart, 
    updateQuantity,
    clearCart 
  } = useCartStore();

  const [voucher, setVoucher] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>('');

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        showToast({
          title: "Lỗi",
          message: "Giỏ hàng trống",
          type: "error"
        });
        return;
      }
      router.push('/checkout/shipping');
      onOpenChange(false);
    } catch (error) {
      console.error('Error during checkout:', error);
      showToast({
        title: "Lỗi",
        message: "Đã có lỗi xảy ra khi xử lý đơn hàng",
        type: "error"
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col" side="right">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Giỏ hàng của bạn ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-muted-foreground">Giỏ hàng của bạn đang trống</p>
            <Button onClick={() => onOpenChange(false)} className="mt-4">
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 my-4">
              <div className="space-y-4 pr-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 bg-muted rounded overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium line-clamp-1">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.brand}
                        {item.size && <span> • Size {item.size}</span>}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded">
                          <button 
                            className="px-2 py-1 text-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-sm">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 text-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div>
                          {item.originalPrice && (
                            <span className="text-sm line-through text-muted-foreground mr-2">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center">
                <Input 
                  placeholder="Mã giảm giá" 
                  className="flex-1"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
                <Button variant="outline" className="ml-2">Áp dụng</Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thuế</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Tổng</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <SheetFooter className="pb-8">
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={isProcessing || items.length === 0}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet; 