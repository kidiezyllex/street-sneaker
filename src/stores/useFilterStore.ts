import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Định nghĩa interface ProductData
interface ProductData {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  brand: string;
  category: string;
  color: string[];
  size: number[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
}

// Mock data cho thương hiệu
const brandsData = [
  { id: 1, name: 'Nike' },
  { id: 2, name: 'Adidas' },
  { id: 3, name: 'Puma' },
  { id: 4, name: 'Salomon' },
  { id: 5, name: 'New Balance' },
];

// Mock data cho danh mục
const categoriesData = [
  { id: 1, name: 'Giày chạy bộ' },
  { id: 2, name: 'Giày thể thao' },
  { id: 3, name: 'Giày tập gym' },
  { id: 4, name: 'Giày đi bộ' },
  { id: 5, name: 'Giày bóng đá' },
];

// Mock data cho kích cỡ
const sizesData = [
  { id: 1, name: '38' },
  { id: 2, name: '39' },
  { id: 3, name: '40' },
  { id: 4, name: '41' },
  { id: 5, name: '42' },
  { id: 6, name: '43' },
  { id: 7, name: '44' },
];

// Mock data cho màu sắc
const colorsData = [
  { id: 1, name: 'Đen' },
  { id: 2, name: 'Trắng' },
  { id: 3, name: 'Xanh' },
  { id: 4, name: 'Đỏ' },
  { id: 5, name: 'Hồng' },
  { id: 6, name: 'Xám' },
  { id: 7, name: 'Cam' },
  { id: 8, name: 'Xanh rêu' },
];

// Mock data cho sản phẩm
export const productsData = [
  {
    id: 1,
    name: 'Giày Chạy Bộ Nam Air Max',
    slug: 'giay-chay-bo-nam-air-max',
    description:
      'Giày chạy bộ cao cấp với công nghệ đệm Air Max, mang lại sự thoải mái tối đa trong mỗi bước chạy.',
    price: 3200000,
    discount: 10,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-300x300.jpg",
    brand: 'Nike',
    category: 'Running',
    color: ['Đen', 'Trắng', 'Xám'],
    size: [39, 40, 41, 42, 43],
    rating: 4.5,
    reviewCount: 120,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 2,
    name: 'Giày Thể Thao Nữ Cloud Runner',
    slug: 'giay-the-thao-nu-cloud-runner',
    description:
      'Giày thể thao nữ nhẹ như mây, thiết kế thời trang và êm ái, phù hợp với mọi hoạt động hàng ngày.',
    price: 2800000,
    discount: 15,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-1-300x300.jpg",
    brand: 'Adidas',
    category: 'Lifestyle',
    color: ['Trắng', 'Hồng', 'Xanh nhạt'],
    size: [36, 37, 38, 39],
    rating: 4.8,
    reviewCount: 95,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 3,
    name: 'Giày Chạy Trail Ultra Boost',
    slug: 'giay-chay-trail-ultra-boost',
    description:
      'Giày chạy địa hình với công nghệ Ultra Boost, mang lại độ bám tốt và sự thoải mái trên mọi địa hình.',
    price: 3800000,
    discount: 5,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-2-300x300.jpg",
    brand: 'Adidas',
    category: 'Trail Running',
    color: ['Đen', 'Xanh dương', 'Cam'],
    size: [40, 41, 42, 43, 44],
    rating: 4.7,
    reviewCount: 65,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 4,
    name: 'Giày Tập Gym Power Flex',
    slug: 'giay-tap-gym-power-flex',
    description:
      'Giày tập gym với đế linh hoạt, hỗ trợ tối đa cho các bài tập sức mạnh và cardio trong phòng gym.',
    price: 2500000,
    discount: 0,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-4-300x300.jpg",
    brand: 'Puma',
    category: 'Training',
    color: ['Đen', 'Xám', 'Xanh lá'],
    size: [39, 40, 41, 42, 43, 44],
    rating: 4.4,
    reviewCount: 48,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 5,
    name: 'Giày Chạy Bộ Nam Premium',
    slug: 'giay-chay-bo-nam-premium',
    description:
      'Giày chạy bộ cao cấp dành cho nam, với công nghệ đệm tiên tiến, mang lại sự thoải mái tối đa trong mỗi bước chạy.',
    price: 4200000,
    discount: 12,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-5-300x300.jpg",
    brand: 'Nike',
    category: 'Running',
    color: ['Đen', 'Trắng', 'Xanh dương'],
    size: [40, 41, 42, 43, 44],
    rating: 4.9,
    reviewCount: 150,
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 6,
    name: 'Giày Thể Thao Nữ Ultra Light',
    slug: 'giay-the-thao-nu-ultra-light',
    description:
      'Giày thể thao nữ siêu nhẹ, thiết kế thời trang và êm ái, phù hợp với mọi hoạt động hàng ngày.',
    price: 2600000,
    discount: 8,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-7-300x300.jpg",
    brand: 'Adidas',
    category: 'Lifestyle',
    color: ['Trắng', 'Hồng', 'Xám'],
    size: [35, 36, 37, 38, 39],
    rating: 4.7,
    reviewCount: 85,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 7,
    name: 'Giày Chạy Trail Địa Hình',
    slug: 'giay-chay-trail-dia-hinh',
    description:
      'Giày chạy địa hình với đế grip cao, thiết kế cho hiệu suất tối đa trên các địa hình gồ ghề và khó khăn.',
    price: 3500000,
    discount: 5,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-6-300x300.jpg",
    brand: 'Salomon',
    category: 'Trail Running',
    color: ['Đen', 'Xanh lá', 'Cam'],
    size: [39, 40, 41, 42, 43],
    rating: 4.6,
    reviewCount: 60,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 8,
    name: 'Giày Tập Gym Đa Năng',
    slug: 'giay-tap-gym-da-nang',
    description:
      'Giày tập gym đa năng, phù hợp cho nhiều loại bài tập khác nhau trong phòng gym.',
    price: 2300000,
    discount: 0,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-3-300x300.jpg",
    brand: 'Under Armour',
    category: 'Training',
    color: ['Đen', 'Xám', 'Đỏ'],
    size: [40, 41, 42, 43],
    rating: 4.3,
    reviewCount: 45,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 9,
    name: "Giày Bóng Đá Mercurial",
    price: 1950000,
    originalPrice: 2190000,
    discount: 11,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-300x300.jpg",
    rating: 5,
    slug: "giay-bong-da-mercurial",
    brand: "Nike",
    colors: ["Đen", "Đỏ", "Xanh"],
    isBestSeller: false,
    stock: 10,
    category: "Giày bóng đá",
    size: ["39", "40", "41", "42", "43"]
  },
  {
    id: 10,
    name: "Giày Đi Bộ Ngoài Trời",
    price: 1350000,
    originalPrice: 1550000,
    discount: 13,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-1-300x300.jpg",
    rating: 4,
    slug: "giay-di-bo-ngoai-troi",
    brand: "New Balance",
    colors: ["Nâu", "Xám", "Đen"],
    isBestSeller: false,
    stock: 8,
    category: "Giày đi bộ",
    size: ["40", "41", "42", "43"]
  },
  {
    id: 11,
    name: "Giày Thể Thao Cao Cấp",
    price: 2150000,
    originalPrice: 2450000,
    discount: 12,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-2-300x300.jpg",
    rating: 5,
    slug: "giay-the-thao-cao-cap",
    brand: "Adidas",
    colors: ["Đen", "Trắng", "Xanh"],
    isBestSeller: true,
    stock: 7,
    category: "Giày thể thao",
    size: ["39", "40", "41", "42"]
  },
  {
    id: 12,
    name: "Giày Đá Bóng Phủi",
    price: 850000,
    originalPrice: 990000,
    discount: 14,
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-4-300x300.jpg",
    rating: 4,
    slug: "giay-da-bong-phui",
    brand: "Nike",
    colors: ["Đen", "Trắng", "Xanh"],
    isBestSeller: false,
    stock: 20,
    category: "Giày bóng đá",
    size: ["39", "40", "41", "42", "43", "44"]
  },
];

interface FilterState {
  // Dữ liệu
  products: any[];
  filteredProducts: any[];
  brands: any[];
  categories: any[];
  colors: any[];
  sizes: any[];
  loading: boolean;
  
  // Bộ lọc
  selectedBrands: string[];
  selectedCategories: string[];
  selectedColors: string[];
  selectedSizes: string[];
  priceRange: [number, number];
  sortOption: string;
  
  // Methods
  addBrandFilter: (brand: string) => void;
  removeBrandFilter: (brand: string) => void;
  addCategoryFilter: (category: string) => void;
  removeCategoryFilter: (category: string) => void;
  addColorFilter: (color: string) => void;
  removeColorFilter: (color: string) => void;
  addSizeFilter: (size: string) => void;
  removeSizeFilter: (size: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortOption: (option: string) => void;
  resetFilters: () => void;
  
  // Các chức năng load dữ liệu
  loadAllData: () => void;
  
  // Helper
  getActiveFilters: () => { name: string; value: string; remove: () => void }[];
}

// Lọc và sắp xếp sản phẩm theo bộ lọc
const filterProducts = (state: FilterState) => {
  let filtered = [...productsData];
  
  // Lọc theo thương hiệu
  if (state.selectedBrands.length > 0) {
    filtered = filtered.filter(product => state.selectedBrands.includes(product.brand));
  }
  
  // Lọc theo danh mục
  if (state.selectedCategories.length > 0) {
    filtered = filtered.filter(product => state.selectedCategories.includes(product.category));
  }
  
  // Lọc theo màu sắc
  if (state.selectedColors.length > 0) {
    filtered = filtered.filter(product => 
      product.colors?.some((color: string) => state.selectedColors.includes(color)) || false
    );
  }
  
  // Lọc theo kích cỡ
  if (state.selectedSizes.length > 0) {
    filtered = filtered.filter(product => 
      product.size.some(size => state.selectedSizes.includes(size.toString()))
    );
  }
  
  // Lọc theo khoảng giá
  filtered = filtered.filter(product => 
    product.price >= state.priceRange[0] && product.price <= state.priceRange[1]
  );
  
  // Sắp xếp
  switch(state.sortOption) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name_asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name_desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default: // 'default' hoặc mặc định
      // Không cần sắp xếp
      break;
  }
  
  return filtered;
};

export const useFilterStore = create(
  persist<FilterState>(
    (set, get) => ({
      // Khởi tạo các giá trị mặc định
      products: [],
      filteredProducts: [],
      brands: [],
      categories: [],
      colors: [],
      sizes: [],
      loading: true,
      
      selectedBrands: [],
      selectedCategories: [],
      selectedColors: [],
      selectedSizes: [],
      priceRange: [0, 5000000],
      sortOption: 'default',
      
      // Thêm/xóa bộ lọc thương hiệu
      addBrandFilter: (brand) => {
        set((state) => {
          const newState = {
            ...state,
            selectedBrands: [...state.selectedBrands, brand]
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      removeBrandFilter: (brand) => {
        set((state) => {
          const newState = {
            ...state,
            selectedBrands: state.selectedBrands.filter(b => b !== brand)
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      // Thêm/xóa bộ lọc danh mục
      addCategoryFilter: (category) => {
        set((state) => {
          const newState = {
            ...state,
            selectedCategories: [...state.selectedCategories, category]
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      removeCategoryFilter: (category) => {
        set((state) => {
          const newState = {
            ...state,
            selectedCategories: state.selectedCategories.filter(c => c !== category)
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      // Thêm/xóa bộ lọc màu sắc
      addColorFilter: (color) => {
        set((state) => {
          const newState = {
            ...state,
            selectedColors: [...state.selectedColors, color]
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      removeColorFilter: (color) => {
        set((state) => {
          const newState = {
            ...state,
            selectedColors: state.selectedColors.filter(c => c !== color)
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      // Thêm/xóa bộ lọc kích cỡ
      addSizeFilter: (size) => {
        set((state) => {
          const newState = {
            ...state,
            selectedSizes: [...state.selectedSizes, size]
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      removeSizeFilter: (size) => {
        set((state) => {
          const newState = {
            ...state,
            selectedSizes: state.selectedSizes.filter(s => s !== size)
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      // Cập nhật khoảng giá
      setPriceRange: (range) => {
        set((state) => {
          const newState = {
            ...state,
            priceRange: range
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      // Cập nhật tùy chọn sắp xếp
      setSortOption: (option) => {
        set((state) => {
          const newState = {
            ...state,
            sortOption: option
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      // Đặt lại tất cả bộ lọc
      resetFilters: () => {
        set((state: any) => {
          const newState = {
            ...state,
            selectedBrands: [],
            selectedCategories: [],
            selectedColors: [],
            selectedSizes: [],
            priceRange: [0, 5000000],
            sortOption: 'default'
          };
          const filteredProducts = filterProducts(newState);
          return { 
            ...newState, 
            products: filteredProducts,
            filteredProducts: filteredProducts
          };
        });
      },
      
      // Lấy bộ lọc đang hoạt động để hiển thị
      getActiveFilters: () => {
        const state = get();
        const filters = [];
        
        // Thêm bộ lọc thương hiệu
        state.selectedBrands.forEach(brand => {
          filters.push({
            name: 'Thương hiệu',
            value: brand,
            remove: () => state.removeBrandFilter(brand)
          });
        });
        
        // Thêm bộ lọc danh mục
        state.selectedCategories.forEach(category => {
          filters.push({
            name: 'Danh mục',
            value: category,
            remove: () => state.removeCategoryFilter(category)
          });
        });
        
        // Thêm bộ lọc màu sắc
        state.selectedColors.forEach(color => {
          filters.push({
            name: 'Màu sắc',
            value: color,
            remove: () => state.removeColorFilter(color)
          });
        });
        
        // Thêm bộ lọc kích cỡ
        state.selectedSizes.forEach(size => {
          filters.push({
            name: 'Kích cỡ',
            value: size,
            remove: () => state.removeSizeFilter(size)
          });
        });
        
        // Thêm bộ lọc giá nếu không phải là giá trị mặc định
        if (state.priceRange[0] > 0 || state.priceRange[1] < 5000000) {
          filters.push({
            name: 'Giá',
            value: `${state.priceRange[0].toLocaleString('vi-VN')}đ - ${state.priceRange[1].toLocaleString('vi-VN')}đ`,
            remove: () => state.setPriceRange([0, 5000000])
          });
        }
        
        return filters;
      },
      
      // Load dữ liệu
      loadAllData: () => {
        set({ loading: true });
        
        // Giả lập delay để mô phỏng việc tải dữ liệu
        setTimeout(() => {
          const filteredProducts = filterProducts({
            brands: brandsData,
            categories: categoriesData,
            colors: colorsData,
            sizes: sizesData,
            selectedBrands: [],
            selectedCategories: [],
            selectedColors: [],
            selectedSizes: [],
            priceRange: [0, 5000000],
            sortOption: 'default',
            products: [],
            filteredProducts: [],
            loading: false,
            addBrandFilter: () => {},
            removeBrandFilter: () => {},
            addCategoryFilter: () => {},
            removeCategoryFilter: () => {},
            addColorFilter: () => {},
            removeColorFilter: () => {},
            addSizeFilter: () => {},
            removeSizeFilter: () => {},
            setPriceRange: () => {},
            setSortOption: () => {},
            resetFilters: () => {},
            loadAllData: () => {},
            getActiveFilters: () => []
          });
          
          set({
            brands: brandsData,
            categories: categoriesData,
            colors: colorsData,
            sizes: sizesData,
            loading: false,
            products: filteredProducts,
            filteredProducts: filteredProducts
          });
        }, 800);
      }
    }),
    {
      name: 'product-filters-storage',
    }
  )
); 