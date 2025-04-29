import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  updateProductStock,
  updateProductImages,
  deleteProduct,
  searchProducts
} from "@/api/product";
import {
  IProductFilter,
  IProductCreate,
  IProductUpdate,
  IProductStatusUpdate,
  IProductStockUpdate,
  IProductImageUpdate,
  IProductSearchParams
} from "@/interface/request/product";
import {
  IProductsResponse,
  IProductResponse,
  IActionResponse
} from "@/interface/response/product";

// === Admin/Staff Product Hooks ===

export const useProducts = (params: IProductFilter = {}): UseQueryResult<IProductsResponse, Error> => {
  return useQuery<IProductsResponse, Error>({
    queryKey: ["products", params],
    queryFn: () => getAllProducts(params),
  });
};

export const useProductDetail = (productId: string): UseQueryResult<IProductResponse, Error> => {
  return useQuery<IProductResponse, Error>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId, // Chỉ fetch khi có productId
  });
};

export const useCreateProduct = (): UseMutationResult<IProductResponse, Error, IProductCreate> => {
  return useMutation<IProductResponse, Error, IProductCreate>({
    mutationFn: (payload) => createProduct(payload),
  });
};

export const useUpdateProduct = (): UseMutationResult<
  IProductResponse,
  Error,
  { productId: string; payload: IProductUpdate }
> => {
  return useMutation<IProductResponse, Error, { productId: string; payload: IProductUpdate }>({
    mutationFn: ({ productId, payload }) => updateProduct(productId, payload),
  });
};

export const useUpdateProductStatus = (): UseMutationResult<
  IProductResponse,
  Error,
  { productId: string; payload: IProductStatusUpdate }
> => {
  return useMutation<IProductResponse, Error, { productId: string; payload: IProductStatusUpdate }>({
    mutationFn: ({ productId, payload }) => updateProductStatus(productId, payload),
  });
};

export const useUpdateProductStock = (): UseMutationResult<
  IProductResponse,
  Error,
  { productId: string; payload: IProductStockUpdate }
> => {
  return useMutation<IProductResponse, Error, { productId: string; payload: IProductStockUpdate }>({
    mutationFn: ({ productId, payload }) => updateProductStock(productId, payload),
  });
};

export const useUpdateProductImages = (): UseMutationResult<
  IProductResponse,
  Error,
  { productId: string; payload: IProductImageUpdate }
> => {
  return useMutation<IProductResponse, Error, { productId: string; payload: IProductImageUpdate }>({
    mutationFn: ({ productId, payload }) => updateProductImages(productId, payload),
  });
};

export const useDeleteProduct = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (productId) => deleteProduct(productId),
  });
};

// === Public Product Hooks ===

export const useSearchProducts = (params: IProductSearchParams): UseQueryResult<IProductsResponse, Error> => {
  return useQuery<IProductsResponse, Error>({
    queryKey: ["searchProducts", params],
    queryFn: () => searchProducts(params),
    enabled: !!params.keyword, // Chỉ fetch khi có từ khóa tìm kiếm
  });
}; 