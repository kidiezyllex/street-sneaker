import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../../stores/cart';
import { useRouter } from 'next/navigation';
import { useToast } from '../../hooks/useToast';
import { createOrder } from '../../services/order';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleCheckout = async () => {
    try {
      console.log('Starting checkout process...');
      if (items.length === 0) {
        showToast({
          title: 'Lỗi',
          message: 'Giỏ hàng trống',
          type: 'error'
        });
        return;
      }

      setIsProcessing(true);
      console.log('Creating order with items:', items);

      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          variant: {
            colorId: item.variant?.colorId,
            sizeId: item.variant?.sizeId
          },
          quantity: item.quantity,
          price: item.product.price
        })),
        subTotal: total,
        total: total,
        shippingAddress: {
          name: "Test User",
          phoneNumber: "0123456789",
          provinceId: "1",
          districtId: "1",
          wardId: "1",
          specificAddress: "Test Address"
        },
        paymentMethod: 'PENDING'
      };

      console.log('Order data:', orderData);

      const response = await createOrder(orderData);
      console.log('Order creation response:', response);
      
      if (response.success) {
        clearCart();
        router.push(`/checkout/${response.data._id}`);
        onClose();
      } else {
        throw new Error('Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      showToast({
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra khi tạo đơn hàng',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Giỏ hàng của bạn</h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Đóng</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {items.map((item) => (
                        <li key={`${item.product._id}-${item.variant?.colorId}-${item.variant?.sizeId}`} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.product.name}</h3>
                                <p className="ml-4">
                                  {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }).format(item.product.price * item.quantity)}
                                </p>
                              </div>
                              {item.variant && (
                                <p className="mt-1 text-sm text-gray-500">{item.variant.name}</p>
                              )}
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product._id,
                                      Math.max(1, item.quantity - 1),
                                      item.variant
                                        ? `${item.variant.colorId}-${item.variant.sizeId}`
                                        : undefined
                                    )
                                  }
                                >
                                  -
                                </button>
                                <span className="mx-2 text-gray-700">{item.quantity}</span>
                                <button
                                  type="button"
                                  className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product._id,
                                      item.quantity + 1,
                                      item.variant
                                        ? `${item.variant.colorId}-${item.variant.sizeId}`
                                        : undefined
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() =>
                                  removeItem(
                                    item.product._id,
                                    item.variant
                                      ? `${item.variant.colorId}-${item.variant.sizeId}`
                                      : undefined
                                  )
                                }
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Tổng tiền</p>
                  <p>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(total)}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Đã bao gồm phí vận chuyển và thuế
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing || items.length === 0}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    hoặc{' '}
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={onClose}
                    >
                      Tiếp tục mua sắm
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 