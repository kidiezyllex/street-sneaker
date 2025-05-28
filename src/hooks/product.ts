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
  searchProducts,
  getAllFilters
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
  IActionResponse,
  IProductFiltersResponse
} from "@/interface/response/product";
import { useBrands, useCategories, useColors, useMaterials, useSizes } from './options';

export const useProducts = (params: IProductFilter = {}): UseQueryResult<IProductsResponse, Error> => {
  return useQuery<IProductsResponse, Error>({
    queryKey: ["products", params],
    queryFn: () => getAllProducts(params),
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
};

export const useProductDetail = (productId: string): UseQueryResult<IProductResponse, Error> => {
  return useQuery<IProductResponse, Error>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId, 
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
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

export const useSearchProducts = (params: IProductSearchParams): UseQueryResult<IProductsResponse, Error> => {
  return useQuery<IProductsResponse, Error>({
    queryKey: ["searchProducts", params],
    queryFn: () => searchProducts(params),
    enabled: !!params.keyword || 
             !!params.brands || 
             !!params.categories || 
             !!params.color || 
             !!params.size || 
             !!params.minPrice || 
             !!params.maxPrice,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}; 

export const useProductFilters = (): UseQueryResult<IProductFiltersResponse, Error> => {
  return useQuery<IProductFiltersResponse, Error>({
    queryKey: ["productFilters"],
    queryFn: () => getAllFilters(),
  });
}; 

export const useSoles = () => {
  return {
    solesData: { data: [] },
    isLoading: false,
    refetch: () => {}
  };
};

export const useCreateSole = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

export const useUpdateSole = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

// Re-export hooks from options.ts
export { useBrands, useCategories, useColors, useMaterials, useSizes }; 