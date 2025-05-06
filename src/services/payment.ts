import { axiosInstance } from './axios';
import { IPaymentResponse } from '../interface/response/payment';

export const createVNPayUrl = async (orderId: string, amount: number, orderInfo: string, orderCode?: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
      };
    }

    console.log('createVNPayUrl - params:', { orderId, amount, orderInfo });
    
    // Sử dụng đường dẫn cố định để tránh vấn đề với biến môi trường
    const apiUrl = 'http://localhost:5000/api/payments/create-vnpay-url';
    console.log('Calling API:', apiUrl);

    // Xử lý lỗi Internal Server Error 500
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          orderId,
          amount,
          orderInfo,
          orderCode
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText, 'Status:', response.status);
        
        // Nếu là lỗi 500, có thể là lỗi kết nối backend
        if (response.status === 500) {
          return {
            success: false,
            message: 'Lỗi kết nối đến máy chủ thanh toán. Vui lòng thử lại sau.'
          };
        }
        
        return {
          success: false,
          message: `Lỗi API (${response.status}): ${errorText}`
        };
      }

      const result = await response.json();
      console.log('createVNPayUrl - response:', result);
      
      // Nếu backend trả về dạng { paymentUrl: "..." }
      if (result.data && result.data.paymentUrl) {
        return {
          success: true,
          data: { paymentUrl: result.data.paymentUrl }
        };
      }
      
      // Hoặc backend trả về dạng { success: true, data: { paymentUrl: "..." } }
      return result;
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return {
        success: false,
        message: 'Lỗi kết nối đến máy chủ thanh toán. Vui lòng thử lại sau.'
      };
    }
  } catch (error) {
    console.error('Error creating VNPay URL:', error);
    return {
      success: false,
      message: `Đã xảy ra lỗi khi tạo đường dẫn thanh toán: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

export const createCODPayment = async (orderId: string, amount: number) => {
  const response = await axiosInstance.post<IPaymentResponse>('/payments/cod', {
    orderId,
    amount
  });
  return response.data;
};

export const getPaymentsByOrderId = async (orderId: string) => {
  const response = await axiosInstance.get<IPaymentResponse>(`/orders/${orderId}/payments`);
  return response.data;
}; 