'use client';

import { useState, useEffect, useMemo } from 'react';
import { CartItem as OldCartItem } from '@/components/POSPage/mockData'; // Keep old CartItem as reference if needed or for gradual update
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@mdi/react';
import { 
  mdiMagnify, 
  mdiPlus, 
  mdiMinus, 
  mdiDelete, 
  mdiCashRegister, 
  mdiTag, 
  mdiQrcodeScan,
  mdiCreditCardOutline,
  mdiCashMultiple,
  mdiReceiptOutline,
  mdiClockOutline,
  mdiInformationOutline,
  mdiReceipt,
  mdiClock,
  mdiAccount
} from '@mdi/js';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from '@/components/ui/skeleton'; // For loading states

import { useProducts, useSearchProducts } from '@/hooks/product';
import { IProductFilter } from '@/interface/request/product';

// Define types based on expected API response
interface ApiVariant {
  _id: string;
  colorId?: { _id: string; name: string; code: string; images?: string[] };
  sizeId?: { _id: string; name: string; value?: string; };
  price: number;
  stock: number;
  images?: string[];
  sku?: string;
}

interface ApiProduct {
  _id: string;
  name: string;
  brand: { _id: string; name: string; } | string;
  category: { _id: string; name: string; } | string;
  description?: string;
  variants: ApiVariant[];
  status?: string;
  createdAt: string; 
}

interface UpdatedCartItem {
  id: string; 
  productId: string;
  variantId: string; 
  name: string;
  colorName: string;
  colorCode?: string; 
  sizeName: string; 
  price: number;
  quantity: number;
  image: string; 
  stock: number; 
}

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [selectedApiVariant, setSelectedApiVariant] = useState<ApiVariant | null>(null);
  
  const [cartItems, setCartItems] = useState<UpdatedCartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [checkoutIsLoading, setCheckoutIsLoading] = useState<boolean>(false); // Renamed from isLoading

  // New states for API data handling
  const [pagination, setPagination] = useState({ page: 1, limit: 12 });
  const [filters, setFilters] = useState<IProductFilter>({ status: 'HOAT_DONG' });
  const [sortOption, setSortOption] = useState<string>('newest'); 
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeCategoryName, setActiveCategoryName] = useState<string>('Tất cả sản phẩm');

  const [stats, setStats] = useState({
    dailySales: 12500000,
    totalOrders: 24,
    averageOrder: 520000,
    pendingOrders: 3
  });

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 'TX-1234', customer: 'Nguyễn Văn A', amount: 1250000, time: '10:25', status: 'completed' },
    { id: 'TX-1233', customer: 'Trần Thị B', amount: 850000, time: '09:40', status: 'completed' },
    { id: 'TX-1232', customer: 'Lê Văn C', amount: 2100000, time: '09:15', status: 'pending' }
  ]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsSearching(searchQuery.length > 0);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    if (activeCategoryName === 'Tất cả sản phẩm') {
      // Remove categories filter if 'All' is selected
      const { categories, ...restFilters } = filters;
      setFilters(restFilters);
    } else {
      // Assuming category name is used as filter value. If API needs ID, adjust accordingly.
      setFilters(prev => ({ ...prev, categories: [activeCategoryName] }));
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [activeCategoryName]);

  const productsHookParams: IProductFilter = {
    ...pagination,
    ...filters,
  };

  const productsQuery = useProducts(productsHookParams);
  const searchQueryHook = useSearchProducts(
    isSearching ? { keyword: searchQuery, status: 'HOAT_DONG', ...pagination, ...filters } : { keyword: '' }
  );

  const {
    data: rawData,
    isLoading: apiIsLoading, // Use this for product list loading
    isError: apiIsError,
    // refetch 
  } = isSearching ? searchQueryHook : productsQuery;

  const processedProducts = useMemo(() => {
    let productsToProcess = (rawData?.data?.products || []) as ApiProduct[];

    // Client-side sorting
    if (sortOption !== 'default' && productsToProcess.length > 0) {
      productsToProcess = [...productsToProcess].sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        switch (sortOption) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'newest':
            return dateB - dateA;
          // Add 'popularity' or other client-side sort cases if needed
          // case 'popularity':
          //   const stockA = a.variants.reduce((total: number, variant: any) => total + variant.stock, 0);
          //   const stockB = b.variants.reduce((total: number, variant: any) => total + variant.stock, 0);
          //   return stockB - stockA; 
          default:
            return 0;
        }
      });
    }
    return productsToProcess;
  }, [rawData, sortOption]);

  const dynamicCategories = useMemo(() => {
    const baseCategories = [{ _id: 'all', name: 'Tất cả sản phẩm' }];
    if (rawData?.data?.products) {
        const uniqueCatObjects = new Map<string, { _id: string; name:string }>();
        rawData.data.products.forEach((p: ApiProduct) => { // Explicitly type p
            if (p.category && typeof p.category === 'object' && p.category._id && p.category.name) {
                uniqueCatObjects.set(p.category._id, { _id: p.category._id, name: p.category.name });
            } else if (typeof p.category === 'string') { // Handle if category is just a string name
                 uniqueCatObjects.set(p.category, { _id: p.category, name: p.category });
            }
        });
        return [...baseCategories, ...Array.from(uniqueCatObjects.values())];
    }
    return baseCategories;
  }, [rawData?.data?.products]);


  const handleProductSelect = (product: ApiProduct) => {
    setSelectedProduct(product);
    if (product.variants && product.variants.length > 0) {
      const firstAvailableVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
      setSelectedApiVariant(firstAvailableVariant);
    } else {
      setSelectedApiVariant(null);
      toast.warn('Sản phẩm này không có biến thể hoặc đã hết hàng.');
    }
  };
  
  const handleColorSelectFromDetail = (colorId: string) => {
    if (!selectedProduct) return;
    const variantWithThisColor = selectedProduct.variants.find(v => v.colorId?._id === colorId && v.stock > 0);
    if (variantWithThisColor) {
      setSelectedApiVariant(variantWithThisColor);
    } else {
      // Fallback or keep current variant if no stock for new color
      const firstVariantOfThisColor = selectedProduct.variants.find(v => v.colorId?._id === colorId);
      if (firstVariantOfThisColor) {
          setSelectedApiVariant(firstVariantOfThisColor); // Select even if out of stock to show details
          if (firstVariantOfThisColor.stock === 0) toast.warn("Màu này đã hết hàng.");
      }
    }
  };
  
  const handleSizeSelectFromDetail = (sizeId: string) => {
    if (!selectedProduct || !selectedApiVariant?.colorId) return;
    const variantWithThisSizeAndColor = selectedProduct.variants.find(v => 
      v.colorId?._id === selectedApiVariant.colorId?._id && v.sizeId?._id === sizeId && v.stock > 0
    );
    if (variantWithThisSizeAndColor) {
      setSelectedApiVariant(variantWithThisSizeAndColor);
    } else {
      const firstVariantOfThisSizeAndColor = selectedProduct.variants.find(v => v.colorId?._id === selectedApiVariant.colorId?._id && v.sizeId?._id === sizeId);
      if (firstVariantOfThisSizeAndColor) {
        setSelectedApiVariant(firstVariantOfThisSizeAndColor);
        if (firstVariantOfThisSizeAndColor.stock === 0) toast.warn("Kích thước này với màu đã chọn đã hết hàng.");
      }
    }
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedApiVariant) {
      toast.error('Vui lòng chọn sản phẩm, màu và kích thước.');
      return;
    }

    if (selectedApiVariant.stock === 0) {
      toast.error('Sản phẩm này đã hết hàng.');
      return;
    }

    const { _id: productId, name: productName } = selectedProduct;
    const { _id: variantId, price, stock, colorId, sizeId, images } = selectedApiVariant;

    const cartItemId = `${productId}-${variantId}`;
    const existingItemIndex = cartItems.findIndex(item => item.id === cartItemId);

    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      if (updatedItems[existingItemIndex].quantity < stock) {
        updatedItems[existingItemIndex].quantity += 1;
        setCartItems(updatedItems);
        toast.success('Đã cập nhật số lượng sản phẩm.');
      } else {
        toast.warn('Số lượng sản phẩm trong kho không đủ.');
        return;
      }
    } else {
      if (1 > stock) {
         toast.warn('Số lượng sản phẩm trong kho không đủ.');
         return;
      }
      const newItem: UpdatedCartItem = {
        id: cartItemId,
        productId: productId,
        variantId: variantId,
        name: productName,
        colorName: colorId?.name || 'N/A',
        colorCode: colorId?.code,
        sizeName: sizeId?.name || sizeId?.value || 'N/A',
        price: price,
        quantity: 1,
        image: images?.[0] || selectedProduct.variants[0]?.images?.[0] || '/placeholder.svg',
        stock: stock,
      };
      setCartItems([...cartItems, newItem]);
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    }
    setSelectedProduct(null);
    setSelectedApiVariant(null);
  };

  const updateCartItemQuantity = (id: string, amount: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + amount;
        if (newQuantity <= 0) return item; // Logic to remove if quantity becomes 0 is handled by filter below
        if (newQuantity > item.stock) {
            toast.warn(`Chỉ còn ${item.stock} sản phẩm trong kho.`);
            return {...item, quantity: item.stock };
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0); 
    setCartItems(updatedItems);
  };

  const removeCartItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SUMMER23') {
      const subtotal = calculateSubtotal();
      if (subtotal >= 1000000) {
        setAppliedDiscount(15);
        toast.success('Đã áp dụng mã giảm giá SUMMER23: Giảm 15%');
      } else {
        toast.error('Đơn hàng chưa đạt giá trị tối thiểu 1,000,000đ');
      }
    } else if (couponCode.toUpperCase() === 'NEWCUSTOMER') {
      const subtotal = calculateSubtotal();
      if (subtotal >= 500000) {
        setAppliedDiscount(10);
        toast.success('Đã áp dụng mã giảm giá NEWCUSTOMER: Giảm 10%');
      } else {
        toast.error('Đơn hàng chưa đạt giá trị tối thiểu 500,000đ');
      }
    } else {
      toast.error('Mã giảm giá không hợp lệ');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * appliedDiscount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng đang trống');
      return;
    }
    
    setCheckoutIsLoading(true);
    
    setTimeout(() => {
      setCheckoutIsLoading(false);
      setShowCheckoutDialog(false);
      
      setStats(prev => ({
        ...prev,
        dailySales: prev.dailySales + calculateTotal(),
        totalOrders: prev.totalOrders + 1,
        averageOrder: Math.round((prev.dailySales + calculateTotal()) / (prev.totalOrders + 1))
      }));
      
      const newTransaction = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: customerName || 'Khách lẻ',
        amount: calculateTotal(),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed'
      };
      
      setRecentTransactions([newTransaction, ...recentTransactions.slice(0, 2)]);
      
      toast.success('Đã thanh toán thành công');
      setCartItems([]);
      setAppliedDiscount(0);
      setCouponCode('');
      setCustomerName('');
      setCustomerPhone('');
      setPaymentMethod('cash');
    }, 1500);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng đang trống');
      return;
    }
    setShowCheckoutDialog(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        handleProceedToCheckout();
      }
      
      if (e.altKey && e.key === 'c') {
        if (cartItems.length > 0) {
          setCartItems([]);
          setSelectedProduct(null);
          setSelectedApiVariant(null);
          toast.success('Đã xóa giỏ hàng');
        }
      }
      
      if (e.altKey && e.key === 's') {
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems]); // Add other dependencies if they are used in the handler and change

  const getBrandName = (brand: ApiProduct['brand']) => typeof brand === 'object' ? brand.name : brand;

  const uniqueColorsForSelectedProduct = useMemo(() => {
    if (!selectedProduct) return [];
    const colorMap = new Map<string, ApiVariant['colorId']>();
    selectedProduct.variants.forEach(variant => {
      if (variant.colorId && variant.colorId._id && !colorMap.has(variant.colorId._id)) {
        colorMap.set(variant.colorId._id, variant.colorId);
      }
    });
    return Array.from(colorMap.values()).filter(Boolean) as NonNullable<ApiVariant['colorId']>[];
  }, [selectedProduct]);

  const availableSizesForSelectedColor = useMemo(() => {
    if (!selectedProduct || !selectedApiVariant?.colorId?._id) return [];
    const sizeMap = new Map<string, ApiVariant['sizeId']>();
    selectedProduct.variants.forEach(variant => {
      if (variant.colorId?._id === selectedApiVariant.colorId?._id && variant.sizeId && variant.sizeId._id && variant.stock > 0) {
        if(!sizeMap.has(variant.sizeId._id)){
            sizeMap.set(variant.sizeId._id, variant.sizeId);
        }
      }
    });
    return Array.from(sizeMap.values()).filter(Boolean) as NonNullable<ApiVariant['sizeId']>[];
  }, [selectedProduct, selectedApiVariant]);


  return (
    <div className="h-full">
      {/* Header with breadcrumb and stats */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bán hàng tại quầy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Icon path={mdiClock} size={0.9}  />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lịch sử giao dịch</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Icon path={mdiReceipt} size={0.9}  />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quản lý hóa đơn</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Icon path={mdiAccount} size={0.9}/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quản lý khách hàng</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Doanh số hôm nay</p>
                <p className="text-xl font-semibold !text-[#374151]/80">{formatCurrency(stats.dailySales)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon path={mdiCashRegister} size={1} className="text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
                <p className="text-xl font-semibold !text-[#374151]/80">{stats.totalOrders} đơn</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon path={mdiReceiptOutline} size={1} className="text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Giá trị trung bình</p>
                <p className="text-xl font-semibold !text-[#374151]/80">{formatCurrency(stats.averageOrder)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                <Icon path={mdiTag} size={1} className="text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Đơn chờ xử lý</p>
                <p className="text-xl font-semibold !text-[#374151]/80">{stats.pendingOrders} đơn</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Icon path={mdiClockOutline} size={1} className="text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products section */}
        <div className="lg:col-span-2 overflow-hidden flex flex-col">
          {/* Search bar and categories */}
          <div className="bg-white rounded-lg p-6 mb-4 shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Icon path={mdiMagnify} size={1} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="product-search"
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="px-4 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <Icon path={mdiQrcodeScan} size={0.8} className="text-white" />
                <span>Quét mã QR</span>
              </button>
            </div>
            
            {/* Categories */}
            <div className="flex overflow-x-auto pb-2 scrollbar-thin gap-2">
              {dynamicCategories.map((category) => (
                <button
                  key={category._id}
                  className={cn(
                    'whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    activeCategoryName === category.name // Compare with name
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-primary'
                  )}
                  onClick={() => {
                    setActiveCategoryName(category.name);
                    setSelectedProduct(null); // Clear selection when category changes
                    setSelectedApiVariant(null);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Products list */}
          <div className="bg-white rounded-lg p-6 flex-1 shadow-sm border border-border hover:shadow-md transition-shadow duration-300 min-h-[400px]">
            {selectedProduct && selectedApiVariant ? ( // Ensure selectedApiVariant is also present
              <div className="mb-4">
                <button
                  className="mb-4 text-sm text-primary font-medium flex items-center hover:text-primary/80 transition-colors"
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedApiVariant(null);
                  }}
                >
                  ← Quay lại danh sách sản phẩm
                </button>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Product image */}
                  <div className="md:w-1/2">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-50 group">
                      <Image
                        src={selectedApiVariant?.images?.[0] || selectedProduct.variants[0]?.images?.[0] || '/placeholder.svg'}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Colors */}
                    {uniqueColorsForSelectedProduct.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-3 !text-[#374151]/80">Màu sắc:</h3>
                      <div className="flex gap-3 flex-wrap">
                        {uniqueColorsForSelectedProduct.map((color) => (
                          <button
                            key={color._id}
                            className={cn(
                              'h-10 w-10 rounded-full border-2 transition-all duration-200 hover:scale-110',
                              selectedApiVariant?.colorId?._id === color._id
                                ? 'border-primary shadow-md'
                                : 'border-gray-200 hover:border-primary/50'
                            )}
                            style={{ backgroundColor: color.code }}
                            onClick={() => handleColorSelectFromDetail(color._id)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    )}
                  </div>
                  
                  {/* Product info */}
                  <div className="md:w-1/2">
                    <h2 className="text-2xl font-bold !text-[#374151]/80">{selectedProduct.name}</h2>
                    <p className="text-gray-500 mb-4">{getBrandName(selectedProduct.brand)}</p>
                    
                    {selectedProduct.description && (
                      <p className="text-gray-600 mb-4 text-sm">{selectedProduct.description}</p>
                    )}
                    
                    {/* Sizes */}
                    {availableSizesForSelectedColor.length > 0 && selectedApiVariant?.colorId && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-3 !text-[#374151]/80">Kích thước:</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableSizesForSelectedColor.map((size) => {
                          // Find the specific variant to check its stock for this size and current color
                           const variantForThisSize = selectedProduct.variants.find(v => v.colorId?._id === selectedApiVariant.colorId?._id && v.sizeId?._id === size._id);
                           const stockForThisSize = variantForThisSize?.stock || 0;
                          return (
                          <button
                            key={size._id}
                            className={cn(
                              'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                              selectedApiVariant?.sizeId?._id === size._id
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary/50 hover:text-primary',
                              stockForThisSize === 0 && 'opacity-50 cursor-not-allowed'
                            )}
                            onClick={() => handleSizeSelectFromDetail(size._id)}
                            disabled={stockForThisSize === 0}
                          >
                            {size.name || size.value}
                            {stockForThisSize === 0 && ' (Hết hàng)'}
                          </button>
                        );
                        })}
                      </div>
                    </div>
                    )}
                    
                    {/* Price and quantity */}
                    {selectedApiVariant && ( // Check selectedApiVariant directly
                      <>
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-1 !text-[#374151]/80">Giá:</h3>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(selectedApiVariant.price)}
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-1 !text-[#374151]/80">Số lượng trong kho:</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600">{selectedApiVariant.stock} sản phẩm</p>
                            <Badge variant={selectedApiVariant.stock > 10 ? "secondary" : selectedApiVariant.stock > 0 ? "outline" : "destructive" }>
                              {selectedApiVariant.stock > 10 ? "Còn hàng" : selectedApiVariant.stock > 0 ? "Sắp hết" : "Hết hàng"}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          className="w-full py-6 text-base"
                          onClick={addToCart}
                          disabled={selectedApiVariant.stock === 0}
                        >
                          Thêm vào giỏ hàng
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="grid" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="grid" className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                      Lưới
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M3 3h18v18H3z" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
                      Bảng
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="text-sm text-gray-500">
                    Hiển thị {apiIsLoading ? <Skeleton className="h-4 w-5 inline-block" /> : processedProducts.length} / {rawData?.data?.pagination?.totalItems || 0} sản phẩm
                  </div>
                </div>
                
                {apiIsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(pagination.limit)].map((_, index) => (
                      <CardSkeleton key={index} />
                    ))}
                  </div>
                ) : apiIsError ? (
                  <div className="text-center py-10 text-red-500">Lỗi khi tải sản phẩm. Vui lòng thử lại.</div>
                ) : processedProducts.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">Không tìm thấy sản phẩm nào.</div>
                ) : (
                <>
                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {processedProducts.map((product) => {
                      const firstVariant = product.variants?.[0];
                      const uniqueColorsCount = new Set(product.variants.map(v => v.colorId?._id)).size;
                      return (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
                          <Image
                            src={firstVariant?.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {uniqueColorsCount > 0 && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
                              {uniqueColorsCount} màu
                            </Badge>
                          </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium !text-[#374151]/80 group-hover:text-primary transition-colors truncate">{product.name}</h3>
                          <p className="text-gray-500 text-sm mb-2 truncate">{getBrandName(product.brand)}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-primary font-medium">
                              {firstVariant ? formatCurrency(firstVariant.price) : 'N/A'}
                            </p>
                            {product.variants.length > 0 && (
                            <div className="flex -space-x-1">
                              {Array.from(new Map(product.variants.map(v => [v.colorId?._id, v.colorId])).values()).slice(0, 3).map((color, idx) => color && (
                                <div 
                                  key={color._id || idx}
                                  className="h-5 w-5 rounded-full border border-white"
                                  style={{ backgroundColor: color.code }}
                                  title={color.name}
                                />
                              ))}
                              {uniqueColorsCount > 3 && (
                                <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-gray-500">
                                  +{uniqueColorsCount - 3}
                                </div>
                              )}
                            </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="table" className="mt-0">
                  <div className="border border-border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left py-3 px-4 font-medium !text-[#374151]/80">Sản phẩm</th>
                          <th className="text-left py-3 px-4 font-medium !text-[#374151]/80">Thương hiệu</th>
                          <th className="text-left py-3 px-4 font-medium !text-[#374151]/80">Giá</th>
                          <th className="text-left py-3 px-4 font-medium !text-[#374151]/80">Màu sắc</th>
                          <th className="text-left py-3 px-4 font-medium !text-[#374151]/80">Kho</th>
                          <th className="text-center py-3 px-4 font-medium !text-[#374151]/80">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processedProducts.map((product) => {
                          const firstVariant = product.variants?.[0];
                          const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                          const uniqueColorsCount = new Set(product.variants.map(v => v.colorId?._id)).size;
                          return (
                          <tr 
                            key={product._id} 
                            className="border-t border-border hover:bg-muted/20 transition-colors cursor-pointer"
                            onClick={() => handleProductSelect(product)}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-50">
                                  <Image
                                    src={firstVariant?.images?.[0] || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-medium !text-[#374151]/80 truncate max-w-[150px]">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 truncate max-w-[100px]">{getBrandName(product.brand)}</td>
                            <td className="py-3 px-4 text-primary font-medium">{firstVariant ? formatCurrency(firstVariant.price) : 'N/A'}</td>
                            <td className="py-3 px-4">
                              {product.variants.length > 0 && (
                              <div className="flex -space-x-1">
                                {Array.from(new Map(product.variants.map(v => [v.colorId?._id, v.colorId])).values()).slice(0, 3).map((color, idx) => color && (
                                  <div 
                                    key={color._id || idx}
                                    className="h-5 w-5 rounded-full border border-white"
                                    style={{ backgroundColor: color.code }}
                                    title={color.name}
                                  />
                                ))}
                                {uniqueColorsCount > 3 && (
                                  <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-gray-500">
                                    +{uniqueColorsCount - 3}
                                  </div>
                                )}
                              </div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={totalStock > 10 ? "secondary" : totalStock > 0 ? "outline" : "destructive"} className="text-xs">
                                {totalStock > 10 ? "Còn hàng" : totalStock > 0 ? "Sắp hết" : "Hết hàng"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                handleProductSelect(product);
                              }}>
                                <Icon path={mdiPlus} size={0.8} className="text-gray-400" />
                              </Button>
                            </td>
                          </tr>
                        );
                        })}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                {/* Pagination (Simplified for now, can be expanded) */}
                {rawData?.data?.pagination && rawData.data.pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPagination(p => ({...p, page: p.page - 1}))} 
                            disabled={pagination.page <= 1}
                            className="mr-2"
                        >
                            Trước
                        </Button>
                        <span className="text-sm p-2">
                            Trang {pagination.page} / {rawData.data.pagination.totalPages}
                        </span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPagination(p => ({...p, page: p.page + 1}))} 
                            disabled={pagination.page >= rawData.data.pagination.totalPages}
                            className="ml-2"
                        >
                            Sau
                        </Button>
                    </div>
                )}
                </>
                )}
              </Tabs>
            )}
          </div>
        </div>
        
        {/* Cart */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col h-full border border-border hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-medium !text-[#374151]/80">Giỏ hàng</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40">
                <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <Icon path={mdiCashRegister} size={1.2} className="text-gray-400" />
                </div>
                <p className="text-gray-400 mb-2">Giỏ hàng trống</p>
                <p className="text-xs text-gray-400">Thêm sản phẩm để bắt đầu đơn hàng</p>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className="flex gap-4 pb-4 border-b border-border"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-gray-50 group">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium !text-[#374151]/80 truncate max-w-[150px]">{item.name}</h3>
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => removeCartItem(item.id)}
                          >
                            <Icon path={mdiDelete} size={0.8} />
                          </button>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span>Size: {item.sizeName}</span> •{' '}
                          <span className="flex items-center">Màu: {item.colorCode && <div className="w-3 h-3 rounded-full mr-1.5 ml-1" style={{backgroundColor: item.colorCode}}></div>} {item.colorName}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border border-border rounded-md">
                            <button
                              className="px-3 py-1.5 text-gray-400 hover:text-primary transition-colors"
                              onClick={() => updateCartItemQuantity(item.id, -1)}
                            >
                              <Icon path={mdiMinus} size={0.7} />
                            </button>
                            <span className="px-3 min-w-[30px] text-center">{item.quantity}</span>
                            <button
                              className="px-3 py-1.5 text-gray-400 hover:text-primary transition-colors"
                              onClick={() => updateCartItemQuantity(item.id, 1)}
                            >
                              <Icon path={mdiPlus} size={0.7} />
                            </button>
                          </div>
                          <span className="font-medium text-primary">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-border">
            {/* Coupon code */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Icon path={mdiTag} size={0.8} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Mã giảm giá"
                    className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <Button
                  variant="secondary"
                  className="px-4 py-2.5"
                  onClick={applyCoupon}
                >
                  Áp dụng
                </Button>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Giảm giá ({appliedDiscount}%):</span>
                  <span>-{formatCurrency(calculateDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg pt-3 border-t border-border">
                <span className="!text-[#374151]/80">Tổng:</span>
                <span className="text-primary">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            
            {/* Checkout button */}
            <Button
              className="w-full py-6 text-base flex items-center justify-center gap-2"
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
            >
              <Icon path={mdiCashRegister} size={1} />
              Thanh toán
              <span className="text-xs opacity-70 ml-1">(Alt+P)</span>
            </Button>
            
            {/* Keyboard shortcuts help */}
            <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
              <Icon path={mdiInformationOutline} size={0.6} className="mr-1 text-gray-400" />
              <span>Alt+S: Tìm kiếm | Alt+C: Xóa giỏ hàng</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Checkout dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="!text-[#374151]/80">Xác nhận thanh toán</DialogTitle>
            <DialogDescription>
              Tổng tiền: {formatCurrency(calculateTotal())}. Hoàn tất thông tin thanh toán để hoàn thành đơn hàng.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="customer-name" className="text-right text-sm !text-[#374151]/80">
                Khách hàng
              </label>
              <Input
                id="customer-name"
                placeholder="Tên khách hàng"
                className="col-span-3"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="customer-phone" className="text-right text-sm !text-[#374151]/80">
                Số điện thoại
              </label>
              <Input
                id="customer-phone"
                placeholder="Số điện thoại"
                className="col-span-3"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="payment-method" className="text-right text-sm !text-[#374151]/80">
                Thanh toán
              </label>
              <Select
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn phương thức thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <Icon path={mdiCashMultiple} size={0.8} className="text-gray-400" />
                      <span>Tiền mặt</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <Icon path={mdiCreditCardOutline} size={0.8} className="text-gray-400" />
                      <span>Thẻ tín dụng</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="transfer">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 10V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4" /><polyline points="14 2 14 8 20 8" /><path d="m10 18 3-3-3-3" /><path d="M4 18v-1a2 2 0 0 1 2-2h6" /></svg>
                      <span>Chuyển khoản</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator className="my-2" />
            
            {/* Order summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Số lượng sản phẩm:</span>
                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Giảm giá ({appliedDiscount}%):</span>
                  <span>-{formatCurrency(calculateDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-base pt-2 border-t border-border">
                <span className="!text-[#374151]/80">Tổng thanh toán:</span>
                <span className="text-primary">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckoutDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleCheckout} disabled={checkoutIsLoading}>
              {checkoutIsLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Icon path={mdiCashRegister} size={0.8} className="mr-2" />
                  Hoàn tất thanh toán
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Skeleton component for product cards loading state
const CardSkeleton = () => (
  <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-5 w-10" />
      </div>
    </div>
  </div>
);
