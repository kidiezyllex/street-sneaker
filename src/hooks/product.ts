import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
  addProductImage,
  updateProductImage,
  deleteProductImage,
  addProductPromotion,
  deleteProductPromotion,
  getAllBrands,
  createBrand,
  updateBrand,
  getAllCategories,
  createCategory,
  updateCategory,
  getAllColors,
  createColor,
  updateColor,
  getAllMaterials,
  createMaterial,
  updateMaterial,
  getAllSizes,
  createSize,
  updateSize,
  getAllSoles,
  createSole,
  updateSole,
  searchProducts,
  getNewestProducts,
  getBestSellingProducts,
  getLowStockProducts,
  filterProducts,
  quickEdit,
  addVariant,
  addImages,
  addMaterial
} from "@/api/product";

import { IProductFilter, IProductVariant, IProductImage, IProductPromotion, IAttributeCreate, IColorCreate } from "@/interface/request/product";
import {
  IProductResponse,
} from "@/interface/response/product";

import {
  type UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

// Hook cho sản phẩm
export const useProducts = (params: IProductFilter = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["products", params],
    queryFn: () => getAllProducts(params),
  });

  return {
    productsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useProductDetail = (productId: string) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  return {
    productData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useCreateProduct = (): UseMutationResult<
  IProductResponse,
  Error,
  any
> => {
  return useMutation<IProductResponse, Error, any>({
    mutationFn: (params: any) => createProduct(params),
  });
};

export const useUpdateProduct = (): UseMutationResult<
  IProductResponse,
  Error,
  { productId: string; payload: any }
> => {
  return useMutation<IProductResponse, Error, { productId: string; payload: any }>({
    mutationFn: ({ productId, payload }) => updateProduct(productId, payload),
  });
};

export const useDeleteProduct = (): UseMutationResult<any, Error, string> => {
  return useMutation<any, Error, string>({
    mutationFn: (productId: string) => deleteProduct(productId),
  });
};

// Hook cho biến thể sản phẩm
export const useAddProductVariant = (): UseMutationResult<
  any,
  Error,
  { productId: string; payload: IProductVariant }
> => {
  return useMutation<any, Error, { productId: string; payload: IProductVariant }>({
    mutationFn: ({ productId, payload }) => addProductVariant(productId, payload),
  });
};

export const useUpdateProductVariant = (): UseMutationResult<
  any,
  Error,
  { productId: string; variantId: string; payload: Partial<IProductVariant> }
> => {
  return useMutation<any, Error, { productId: string; variantId: string; payload: Partial<IProductVariant> }>({
    mutationFn: ({ productId, variantId, payload }) => updateProductVariant(productId, variantId, payload),
  });
};

export const useDeleteProductVariant = (): UseMutationResult<
  any,
  Error,
  { productId: string; variantId: string }
> => {
  return useMutation<any, Error, { productId: string; variantId: string }>({
    mutationFn: ({ productId, variantId }) => deleteProductVariant(productId, variantId),
  });
};

// Hook cho hình ảnh sản phẩm
export const useAddProductImage = (): UseMutationResult<
  any,
  Error,
  { productId: string; variantId: string; payload: IProductImage }
> => {
  return useMutation<any, Error, { productId: string; variantId: string; payload: IProductImage }>({
    mutationFn: ({ productId, variantId, payload }) => addProductImage(productId, variantId, payload),
  });
};

export const useUpdateProductImage = (): UseMutationResult<
  any,
  Error,
  { productId: string; variantId: string; imageId: string; payload: Partial<IProductImage> }
> => {
  return useMutation<any, Error, { productId: string; variantId: string; imageId: string; payload: Partial<IProductImage> }>({
    mutationFn: ({ productId, variantId, imageId, payload }) => updateProductImage(productId, variantId, imageId, payload),
  });
};

export const useDeleteProductImage = (): UseMutationResult<
  any,
  Error,
  { productId: string; variantId: string; imageId: string }
> => {
  return useMutation<any, Error, { productId: string; variantId: string; imageId: string }>({
    mutationFn: ({ productId, variantId, imageId }) => deleteProductImage(productId, variantId, imageId),
  });
};

// Hook cho khuyến mãi
export const useAddProductPromotion = (): UseMutationResult<
  any,
  Error,
  { productId: string; variantId: string; payload: IProductPromotion }
> => {
  return useMutation<any, Error, { productId: string; variantId: string; payload: IProductPromotion }>({
    mutationFn: ({ productId, variantId, payload }) => addProductPromotion(productId, variantId, payload),
  });
};

export const useDeleteProductPromotion = (): UseMutationResult<
  any,
  Error,
  { productId: string; variantId: string; promotionId: string }
> => {
  return useMutation<any, Error, { productId: string; variantId: string; promotionId: string }>({
    mutationFn: ({ productId, variantId, promotionId }) => deleteProductPromotion(productId, variantId, promotionId),
  });
};

// Hook cho các thuộc tính sản phẩm
export const useBrands = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getAllBrands(),
  });

  return {
    brandsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useCreateBrand = (): UseMutationResult<
  any,
  Error,
  IAttributeCreate
> => {
  return useMutation<any, Error, IAttributeCreate>({
    mutationFn: (params: IAttributeCreate) => createBrand(params),
  });
};

export const useUpdateBrand = (): UseMutationResult<
  any,
  Error,
  { brandId: string; payload: Partial<IAttributeCreate> }
> => {
  return useMutation<any, Error, { brandId: string; payload: Partial<IAttributeCreate> }>({
    mutationFn: ({ brandId, payload }) => updateBrand(brandId, payload),
  });
};

export const useCategories = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });

  return {
    categoriesData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useCreateCategory = (): UseMutationResult<
  any,
  Error,
  IAttributeCreate
> => {
  return useMutation<any, Error, IAttributeCreate>({
    mutationFn: (params: IAttributeCreate) => createCategory(params),
  });
};

export const useUpdateCategory = (): UseMutationResult<
  any,
  Error,
  { categoryId: string; payload: Partial<IAttributeCreate> }
> => {
  return useMutation<any, Error, { categoryId: string; payload: Partial<IAttributeCreate> }>({
    mutationFn: ({ categoryId, payload }) => updateCategory(categoryId, payload),
  });
};

export const useColors = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["colors"],
    queryFn: () => getAllColors(),
  });

  return {
    colorsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useCreateColor = (): UseMutationResult<
  any,
  Error,
  IColorCreate
> => {
  return useMutation<any, Error, IColorCreate>({
    mutationFn: (params: IColorCreate) => createColor(params),
  });
};

export const useUpdateColor = (): UseMutationResult<
  any,
  Error,
  { colorId: string; payload: Partial<IColorCreate> }
> => {
  return useMutation<any, Error, { colorId: string; payload: Partial<IColorCreate> }>({
    mutationFn: ({ colorId, payload }) => updateColor(colorId, payload),
  });
};

export const useMaterials = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["materials"],
    queryFn: () => getAllMaterials(),
  });

  return {
    materialsData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useCreateMaterial = (): UseMutationResult<
  any,
  Error,
  IAttributeCreate
> => {
  return useMutation<any, Error, IAttributeCreate>({
    mutationFn: (params: IAttributeCreate) => createMaterial(params),
  });
};

export const useUpdateMaterial = (): UseMutationResult<
  any,
  Error,
  { materialId: string; payload: Partial<IAttributeCreate> }
> => {
  return useMutation<any, Error, { materialId: string; payload: Partial<IAttributeCreate> }>({
    mutationFn: ({ materialId, payload }) => updateMaterial(materialId, payload),
  });
};

export const useSizes = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["sizes"],
    queryFn: () => getAllSizes(),
  });

  return {
    sizesData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useCreateSize = (): UseMutationResult<
  any,
  Error,
  IAttributeCreate
> => {
  return useMutation<any, Error, IAttributeCreate>({
    mutationFn: (params: IAttributeCreate) => createSize(params),
  });
};

export const useUpdateSize = (): UseMutationResult<
  any,
  Error,
  { sizeId: string; payload: Partial<IAttributeCreate> }
> => {
  return useMutation<any, Error, { sizeId: string; payload: Partial<IAttributeCreate> }>({
    mutationFn: ({ sizeId, payload }) => updateSize(sizeId, payload),
  });
};

export const useSoles = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["soles"],
    queryFn: () => getAllSoles(),
  });

  return {
    solesData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useCreateSole = (): UseMutationResult<
  any,
  Error,
  IAttributeCreate
> => {
  return useMutation<any, Error, IAttributeCreate>({
    mutationFn: (params: IAttributeCreate) => createSole(params),
  });
};

export const useUpdateSole = (): UseMutationResult<
  any,
  Error,
  { soleId: string; payload: Partial<IAttributeCreate> }
> => {
  return useMutation<any, Error, { soleId: string; payload: Partial<IAttributeCreate> }>({
    mutationFn: ({ soleId, payload }) => updateSole(soleId, payload),
  });
};

// Hook cho tìm kiếm và lọc sản phẩm
export const useSearchProducts = (query: string, page: number = 1, limit: number = 10) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["search", query, page, limit],
    queryFn: () => searchProducts(query, page, limit),
    enabled: !!query,
  });

  return {
    searchData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useNewestProducts = (limit: number = 8) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["newest", limit],
    queryFn: () => getNewestProducts(limit),
  });

  return {
    newestData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useBestSellingProducts = (limit: number = 8) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["bestSelling", limit],
    queryFn: () => getBestSellingProducts(limit),
  });

  return {
    bestSellingData: data,
    isLoading,
    isFetching,
    refetch
  };
};

export const useLowStockProducts = (threshold: number = 10, limit: number = 20) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["lowStock", threshold, limit],
    queryFn: () => getLowStockProducts(threshold, limit),
  });

  return {
    lowStockData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook cho lọc sản phẩm
export const useFilterProducts = (params: any = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["filterProducts", params],
    queryFn: () => filterProducts(params),
  });

  return {
    filteredData: data,
    isLoading,
    isFetching,
    refetch
  };
};

// Hook cho chỉnh sửa nhanh sản phẩm
export const useQuickEditProduct = (): UseMutationResult<
  any,
  Error,
  { productId: string; payload: any }
> => {
  return useMutation<any, Error, { productId: string; payload: any }>({
    mutationFn: ({ productId, payload }) => quickEdit(productId, payload),
  });
};

// Hook cho thêm biến thể
export const useAddVariant = (): UseMutationResult<
  any,
  Error,
  { productId: string; payload: any }
> => {
  return useMutation<any, Error, { productId: string; payload: any }>({
    mutationFn: ({ productId, payload }) => addVariant(productId, payload),
  });
};

// Hook cho thêm hình ảnh
export const useAddImages = (): UseMutationResult<
  any,
  Error,
  { productId: string; files: File[]; color: string }
> => {
  return useMutation<any, Error, { productId: string; files: File[]; color: string }>({
    mutationFn: ({ productId, files, color }) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('color', color);
      return addImages(productId, formData);
    },
  });
};

// Hook cho thêm vật liệu
export const useAddMaterial = (): UseMutationResult<
  any,
  Error,
  { productId: string; payload: any }
> => {
  return useMutation<any, Error, { productId: string; payload: any }>({
    mutationFn: ({ productId, payload }) => addMaterial(productId, payload),
  });
}; 