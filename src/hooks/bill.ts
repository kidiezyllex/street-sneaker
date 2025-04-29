import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllBills, 
  getBillById, 
  searchBill, 
  createBill, 
  updateBill, 
  updateBillStatus, 
  addBillDetail, 
  updateBillDetail, 
  deleteBillDetail, 
  addTransaction, 
  processBillReturn, 
  deleteBill,
  getCustomerBills
} from "@/api/bill";

import { 
  IBillFilter, 
  IBillCreate, 
  IBillUpdate, 
  IBillStatusUpdate, 
  IBillItemCreate, 
  IBillItemUpdate, 
  IBillTransaction, 
  IBillReturn 
} from "@/interface/request/bill";

// Hook lấy danh sách đơn hàng
export const useBills = (params: IBillFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["bills", params],
    queryFn: () => getAllBills(params),
    staleTime: 10000,
    placeholderData: (previousData) => previousData
  });

  return {
    billsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook tìm kiếm đơn hàng
export const useSearchBills = (params: IBillFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["searchBills", params],
    queryFn: () => searchBill(params),
    staleTime: 10000,
    placeholderData: (previousData) => previousData
  });

  return {
    searchData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook lấy chi tiết đơn hàng
export const useBillDetail = (billId: string | undefined) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["bill", billId],
    queryFn: () => getBillById(billId as string),
    enabled: !!billId,
    staleTime: 10000
  });

  return {
    billData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook tạo đơn hàng mới
export const useCreateBill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IBillCreate) => createBill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    }
  });
};

// Hook cập nhật thông tin đơn hàng
export const useUpdateBill = (billId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IBillUpdate) => updateBill(billId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill", billId] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    }
  });
};

// Hook cập nhật trạng thái đơn hàng
export const useUpdateBillStatus = (billId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IBillStatusUpdate) => updateBillStatus(billId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill", billId] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    }
  });
};

// Hook thêm sản phẩm vào đơn hàng
export const useAddBillItem = (billId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IBillItemCreate) => addBillDetail(billId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill", billId] });
    }
  });
};

// Hook cập nhật sản phẩm trong đơn hàng
export const useUpdateBillItem = (billId: string, detailId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IBillItemUpdate) => updateBillDetail(billId, detailId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill", billId] });
    }
  });
};

// Hook xóa sản phẩm khỏi đơn hàng
export const useDeleteBillItem = (billId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (detailId: string) => deleteBillDetail(billId, detailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill", billId] });
    }
  });
};

// Hook thêm giao dịch thanh toán
export const useAddBillTransaction = (billId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IBillTransaction) => addTransaction(billId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill", billId] });
    }
  });
};

// Hook xử lý trả hàng
export const useBillReturn = (billId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: IBillReturn) => processBillReturn(billId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill", billId] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    }
  });
};

// Hook xóa đơn hàng
export const useDeleteBill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (billId: string) => deleteBill(billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    }
  });
};

// Hook lấy đơn hàng của khách hàng
export const useCustomerBills = (params: IBillFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["customerBills", params],
    queryFn: () => getCustomerBills(params),
    staleTime: 10000,
    placeholderData: (previousData) => previousData
  });

  return {
    customerBillsData: data,
    isLoading,
    isFetching,
    refetch
  };
}; 