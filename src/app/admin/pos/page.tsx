'use client';

import { useState, useEffect, useMemo } from 'react';
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
  mdiCashMultiple,
  mdiReceiptOutline,
  mdiClockOutline,
  mdiInformationOutline,
  mdiReceipt,
  mdiClock,
  mdiAccount,
  mdiContentCopy,
  mdiPrinter,
  mdiChevronLeft,
  mdiPalette,
  mdiCheck,
  mdiRuler,
  mdiCurrencyUsd,
  mdiPackageVariant,
  mdiCartPlus,
  mdiBarcode,
  mdiInvoicePlus,
  mdiClose,
  mdiCart,
  mdiChevronDown
} from '@mdi/js';
import { checkImageUrl, cn } from '@/lib/utils';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { useVouchers, useIncrementVoucherUsage } from '@/hooks/voucher';
import { useQuery } from '@tanstack/react-query';
import { getAllVouchers } from '@/api/voucher';
import { IVouchersResponse } from "@/interface/response/voucher";
import { useProducts, useSearchProducts } from '@/hooks/product';
import { usePromotions } from '@/hooks/promotion';
import { applyPromotionsToProducts } from '@/lib/promotions';
import { IProductFilter } from '@/interface/request/product';
import { usePosStore } from '@/stores/posStore';
import { useCreatePOSOrder } from '@/hooks/order';
import { IPOSOrderCreateRequest } from '@/interface/request/order';
import { usePOSCartStore, POSCartItem } from '@/stores/usePOSCartStore';
import { usePendingCartsStore, PendingCart } from '@/stores/usePendingCartsStore';
import { useAccounts } from '@/hooks/account';
import { IAccount } from '@/interface/response/account';

import jsPDF from "jspdf";
import { CustomScrollArea } from '@/components/ui/custom-scroll-area';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';

// QR Code Component
const QRCodeComponent = ({ value, size = 200 }: { value: string; size?: number }) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

  return (
    <Image
      src={qrCodeUrl}
      alt="QR Code"
      width={size}
      height={size}
      className="border border-gray-200 rounded"
    />
  );
};

// Card Skeleton Component
const CardSkeleton = () => (
  <div className="bg-white rounded-[6px] border border-border shadow-sm overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <div className="flex -space-x-1">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-8 w-full mt-3" />
    </div>
  </div>
);

interface ApiVariant {
  _id: string;
  colorId?: { _id: string; name: string; code: string; images?: string[] };
  sizeId?: { _id: string; name: string; value?: string; };
  price: number;
  stock: number;
  images?: string[];
  sku?: string;
  actualSizeId?: string;
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
interface InvoiceShopInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface InvoiceCustomerInfo {
  name: string;
  phone: string;
}

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  color: string;
  size: string;
}

interface InvoiceData {
  shopInfo: InvoiceShopInfo;
  customerInfo: InvoiceCustomerInfo;
  orderId: string;
  employee: string;
  createdAt: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  voucherCode?: string;
  total: number;
  cashReceived: number;
  changeGiven: number;
  paymentMethod: string;
}

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [selectedApiVariant, setSelectedApiVariant] = useState<ApiVariant | null>(null);

  // Pending carts store
  const {
    carts: pendingCarts,
    activeCartId,
    createNewCart,
    deleteCart,
    setActiveCart,
    addItemToCart: addItemToPendingCart,
    removeItemFromCart: removeItemFromPendingCart,
    updateItemQuantityInCart: updateItemQuantityInPendingCart,
    clearCartItems: clearPendingCartItems,
    setCartDiscount: setPendingCartDiscount,
    getActiveCart,
  } = usePendingCartsStore();

  // Get active cart data
  const activeCart = getActiveCart();

  // Use active cart data or fallback to main cart store
  const cartItems = activeCart?.items || [];
  const appliedDiscount = activeCart?.appliedDiscount || 0;
  const appliedVoucher = activeCart?.appliedVoucher || null;
  const couponCode = activeCart?.couponCode || '';

  // Main cart store (for backward compatibility and checkout)
  const {
    items: mainCartItems,
    appliedDiscount: mainAppliedDiscount,
    appliedVoucher: mainAppliedVoucher,
    couponCode: mainCouponCode,
    addToCart: addToCartStore,
    removeFromCart: removeFromCartStore,
    updateQuantity: updateQuantityStore,
    clearCart: clearCartStore,
    setDiscount,
    setVoucher,
    setCouponCode,
    calculateSubtotal,
    calculateTotal
  } = usePOSCartStore();

  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('guest');
  const [checkoutIsLoading, setCheckoutIsLoading] = useState<boolean>(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState<boolean>(false);
  const [transferPaymentCompleted, setTransferPaymentCompleted] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 6 });
  const [filters, setFilters] = useState<IProductFilter>({ status: 'HOAT_DONG' });
  const [sortOption, setSortOption] = useState<string>('newest');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeCategoryName, setActiveCategoryName] = useState<string>('Tất cả sản phẩm');
  const [showVouchersDialog, setShowVouchersDialog] = useState<boolean>(false);

  const [cashReceived, setCashReceived] = useState<number | string>('');
  const [showInvoiceDialog, setShowInvoiceDialog] = useState<boolean>(false);
  const [currentInvoiceData, setCurrentInvoiceData] = useState<InvoiceData | null>(null);
  const [showDeleteCartDialog, setShowDeleteCartDialog] = useState<boolean>(false);
  const [cartToDelete, setCartToDelete] = useState<string | null>(null);
  const [showCartItemsDialog, setShowCartItemsDialog] = useState<boolean>(false);
  const [selectedCartForView, setSelectedCartForView] = useState<string | null>(null);

  const stats = usePosStore((state) => state.stats);
  const updateStatsOnCheckout = usePosStore((state) => state.updateStatsOnCheckout);
  const createOrderMutation = useCreatePOSOrder();

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 'TX-1234', customer: 'Nguyễn Văn A', amount: 1250000, time: '10:25', status: 'completed' },
    { id: 'TX-1233', customer: 'Trần Thị B', amount: 850000, time: '09:40', status: 'completed' },
    { id: 'TX-1232', customer: 'Lê Văn C', amount: 2100000, time: '09:15', status: 'pending' }
  ]);

  const { mutate: incrementVoucherUsageMutation } = useIncrementVoucherUsage();

  const accountsParams = useMemo(() => ({
    role: 'CUSTOMER' as const,
    status: 'HOAT_DONG' as const,
    limit: 100
  }), []);

  const { data: usersData, isLoading: isLoadingUsers } = useAccounts(accountsParams);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsSearching(searchQuery.length > 0);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    setFilters(prevFilters => {
      if (activeCategoryName === 'Tất cả sản phẩm') {
        const { categories, ...restFilters } = prevFilters;
        if (prevFilters.categories) {
          return restFilters;
        }
        return prevFilters;
      } else {
        if (!prevFilters.categories || prevFilters.categories.length !== 1 || prevFilters.categories[0] !== activeCategoryName) {
          return { ...prevFilters, categories: [activeCategoryName] };
        }
        return prevFilters;
      }
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [activeCategoryName]);

  const productsHookParams: IProductFilter = useMemo(() => ({
    ...pagination,
    ...filters,
  }), [pagination, filters]);

  const productsQuery = useProducts(productsHookParams);

  const searchQueryParams = useMemo(() =>
    isSearching ? { keyword: searchQuery, status: 'HOAT_DONG', ...pagination, ...filters } : { keyword: '' }
    , [isSearching, searchQuery, pagination, filters]);

  const searchQueryHook = useSearchProducts(searchQueryParams);

  const {
    data: rawData,
    isLoading: apiIsLoading,
    isError: apiIsError,
  } = isSearching ? searchQueryHook : productsQuery;

  // Get promotions data
  const promotionsParams = useMemo(() => ({ status: 'HOAT_DONG' as const }), []);
  const { data: promotionsData } = usePromotions(promotionsParams);

  // Apply promotions to products
  const dataWithPromotions = useMemo(() => {
    if (!rawData || !rawData.data || !rawData.data.products) return rawData;

    let products = [...rawData.data.products];

    // Apply promotions to get correct pricing with highest discount
    if (promotionsData?.data?.promotions) {
      products = applyPromotionsToProducts(products, promotionsData.data.promotions);
    }

    return {
      ...rawData,
      data: {
        ...rawData.data,
        products,
      },
    };
  }, [rawData, promotionsData]);

  const processedProducts = useMemo(() => {
    let productsToProcess = (dataWithPromotions?.data?.products || []) as ApiProduct[];

    if (sortOption !== 'default' && productsToProcess.length > 0) {
      productsToProcess = [...productsToProcess].sort((a, b) => {
        const priceA = (a as any).hasDiscount ? (a as any).discountedPrice : (a.variants[0]?.price || 0);
        const priceB = (b as any).hasDiscount ? (b as any).discountedPrice : (b.variants[0]?.price || 0);
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        switch (sortOption) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'newest':
            return dateB - dateA;
          default:
            return 0;
        }
      });
    }
    return productsToProcess;
  }, [dataWithPromotions, sortOption]);

  const dynamicCategories = useMemo(() => {
    const baseCategories = [{ _id: 'all', name: 'Tất cả sản phẩm' }];
    if (dataWithPromotions?.data?.products) {
      const uniqueCatObjects = new Map<string, { _id: string; name: string }>();
      dataWithPromotions.data.products.forEach((p: ApiProduct) => {
        if (p.category && typeof p.category === 'object' && p.category._id && p.category.name) {
          uniqueCatObjects.set(p.category._id, { _id: p.category._id, name: p.category.name });
        } else if (typeof p.category === 'string') {
          uniqueCatObjects.set(p.category, { _id: p.category, name: p.category });
        }
      });
      return [...baseCategories, ...Array.from(uniqueCatObjects.values())];
    }
    return baseCategories;
  }, [dataWithPromotions?.data?.products]);


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
      const firstVariantOfThisColor = selectedProduct.variants.find(v => v.colorId?._id === colorId);
      if (firstVariantOfThisColor) {
        setSelectedApiVariant(firstVariantOfThisColor);
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

  // Helper function to add item to the correct cart (pending or main)
  const addItemToCorrectCart = (product: ApiProduct, variant: ApiVariant) => {
    const cartItemId = `${product._id}-${variant._id}`;
    const finalPrice = (product as any).hasDiscount ? (product as any).discountedPrice : variant.price;

    const newItem: POSCartItem = {
      id: cartItemId,
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      colorName: variant.colorId?.name || 'N/A',
      colorCode: variant.colorId?.code,
      sizeName: variant.sizeId?.name || variant.sizeId?.value || 'N/A',
      price: finalPrice,
      originalPrice: (product as any).hasDiscount ? (product as any).originalPrice : undefined,
      discountPercent: (product as any).hasDiscount ? (product as any).discountPercent : undefined,
      hasDiscount: (product as any).hasDiscount || false,
      quantity: 1,
      image: variant.images?.[0] || product.variants[0]?.images?.[0] || '/placeholder.svg',
      stock: variant.stock,
      actualColorId: variant.colorId?._id,
      actualSizeId: variant.sizeId?._id,
    };

    if (activeCartId) {
      // Add to pending cart
      const existingItem = cartItems.find(item => item.id === cartItemId);
      const activeCartName = pendingCarts.find(cart => cart.id === activeCartId)?.name || 'Giỏ hàng';
      
      if (existingItem) {
        if (existingItem.quantity < variant.stock) {
          updateItemQuantityInPendingCart(activeCartId, cartItemId, 1);
          toast.success(`Đã cập nhật số lượng sản phẩm trong ${activeCartName}.`);
        } else {
          toast.warn('Số lượng sản phẩm trong kho không đủ.');
        }
      } else {
        addItemToPendingCart(activeCartId, newItem);
        toast.success(`Đã thêm sản phẩm vào ${activeCartName}`);
      }
    } else {
      // Fallback to main cart if no pending cart is active
      const existingItem = mainCartItems.find(item => item.id === cartItemId);
      if (existingItem) {
        if (existingItem.quantity < variant.stock) {
          updateQuantityStore(cartItemId, 1);
          toast.success('Đã cập nhật số lượng sản phẩm.');
        } else {
          toast.warn('Số lượng sản phẩm trong kho không đủ.');
        }
      } else {
        addToCartStore(newItem);
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
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

    addItemToCorrectCart(selectedProduct, selectedApiVariant);

    setSelectedProduct(null);
    setSelectedApiVariant(null);
  };

  const updateCartItemQuantity = (id: string, amount: number) => {
    if (activeCartId) {
      const item = cartItems.find(item => item.id === id);
      if (!item) return;

      const newQuantity = item.quantity + amount;
      if (newQuantity <= 0) {
        removeItemFromPendingCart(activeCartId, id);
        return;
      }

      if (newQuantity > item.stock) {
        toast.warn(`Chỉ còn ${item.stock} sản phẩm trong kho.`);
        return;
      }

      updateItemQuantityInPendingCart(activeCartId, id, amount);

      // Check voucher validity after quantity update
      if (appliedVoucher) {
        const subtotal = calculateCartSubtotal();
        if (subtotal < appliedVoucher.minOrderValue) {
          toast.warn(`Đơn hàng không còn đủ điều kiện cho mã "${appliedVoucher.code}". Đã xóa mã.`);
          setPendingCartDiscount(activeCartId, 0, null, '');
        } else {
          let newDiscountAmount = 0;
          if (appliedVoucher.type === 'PERCENTAGE') {
            newDiscountAmount = (subtotal * appliedVoucher.value) / 100;
            if ((appliedVoucher as any).maxValue && newDiscountAmount > (appliedVoucher as any).maxValue) {
              newDiscountAmount = (appliedVoucher as any).maxValue;
            }
          } else if (appliedVoucher.type === 'FIXED_AMOUNT') {
            newDiscountAmount = appliedVoucher.value;
          }
          newDiscountAmount = Math.min(newDiscountAmount, subtotal);
          setPendingCartDiscount(activeCartId, newDiscountAmount, appliedVoucher, couponCode);
        }
      }
    } else {
      // Fallback to main cart
      const item = mainCartItems.find(item => item.id === id);
      if (!item) return;

      const newQuantity = item.quantity + amount;
      if (newQuantity <= 0) {
        removeFromCartStore(id);
        return;
      }

      if (newQuantity > item.stock) {
        toast.warn(`Chỉ còn ${item.stock} sản phẩm trong kho.`);
        return;
      }

      updateQuantityStore(id, amount);
    }
  };

  const removeCartItem = (id: string) => {
    if (activeCartId) {
      removeItemFromPendingCart(activeCartId, id);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');

      // Check voucher validity after item removal
      if (appliedVoucher) {
        const subtotal = calculateCartSubtotal();
        if (subtotal < appliedVoucher.minOrderValue || cartItems.length <= 1) {
          toast.warn(`Đơn hàng không còn đủ điều kiện cho mã "${appliedVoucher.code}" hoặc giỏ hàng trống. Đã xóa mã.`);
          setPendingCartDiscount(activeCartId, 0, null, '');
        }
      }
    } else {
      removeFromCartStore(id);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  };

  // New function to remove item from any specific cart
  const removeItemFromSpecificCart = (cartId: string, itemId: string) => {
    const cart = pendingCarts.find(c => c.id === cartId);
    if (!cart) return;

    removeItemFromPendingCart(cartId, itemId);
    toast.success(`Đã xóa sản phẩm khỏi ${cart.name}`);

    // Check voucher validity after item removal if this is the active cart
    if (cartId === activeCartId && appliedVoucher) {
      const subtotal = calculateCartSubtotal();
      if (subtotal < appliedVoucher.minOrderValue || cartItems.length <= 1) {
        toast.warn(`Đơn hàng không còn đủ điều kiện cho mã "${appliedVoucher.code}" hoặc giỏ hàng trống. Đã xóa mã.`);
        setPendingCartDiscount(cartId, 0, null, '');
      }
    }
  };

  const { data: foundVoucherData, isLoading: isFetchingVoucher, refetch: fetchVoucherByCode } = useQuery<IVouchersResponse, Error>({
    queryKey: ['voucherByCodeToApply', couponCode],
    queryFn: () => getAllVouchers({ code: couponCode, status: 'HOAT_DONG', limit: 1, page: 1 }),
    enabled: false,
  });

  const applyCoupon = async () => {
    if (!couponCode) {
      toast.error('Vui lòng nhập mã giảm giá.');
      return;
    }

    const { data: voucherDataResult, isError: voucherFetchError } = await fetchVoucherByCode();

    if (voucherFetchError) {
      toast.error('Có lỗi xảy ra khi tìm mã giảm giá.');
      if (activeCartId) {
        setPendingCartDiscount(activeCartId, 0, null, '');
      } else {
        setVoucher(null);
        setDiscount(0);
      }
      return;
    }

    const voucher = voucherDataResult?.data?.vouchers?.[0];

    if (voucher) {
      const subtotal = calculateCartSubtotal();
      if (subtotal < voucher.minOrderValue) {
        toast.error(`Đơn hàng chưa đạt giá trị tối thiểu ${formatCurrency(voucher.minOrderValue)} để áp dụng mã này.`);
        if (activeCartId) {
          setPendingCartDiscount(activeCartId, 0, null, '');
        } else {
          setVoucher(null);
          setDiscount(0);
        }
        return;
      }

      if (voucher.quantity <= voucher.usedCount) {
        toast.error('Mã giảm giá này đã hết lượt sử dụng.');
        if (activeCartId) {
          setPendingCartDiscount(activeCartId, 0, null, '');
        } else {
          setVoucher(null);
          setDiscount(0);
        }
        return;
      }

      if (new Date(voucher.endDate) < new Date()) {
        toast.error('Mã giảm giá đã hết hạn.');
        if (activeCartId) {
          setPendingCartDiscount(activeCartId, 0, null, '');
        } else {
          setVoucher(null);
          setDiscount(0);
        }
        return;
      }

      let discountAmount = 0;
      if (voucher.type === 'PERCENTAGE') {
        discountAmount = (subtotal * voucher.value) / 100;
        if ((voucher as any).maxValue && discountAmount > (voucher as any).maxValue) {
          discountAmount = (voucher as any).maxValue;
        }
      } else if (voucher.type === 'FIXED_AMOUNT') {
        discountAmount = voucher.value;
      }

      discountAmount = Math.min(discountAmount, subtotal);

      // Update the correct cart store based on whether there's an active pending cart
      if (activeCartId) {
        setPendingCartDiscount(activeCartId, discountAmount, voucher, couponCode);
      } else {
        setDiscount(discountAmount);
        setVoucher(voucher);
      }
      
      toast.success(`Đã áp dụng mã giảm giá "${voucher.code}".`);
    } else {
      toast.error('Mã giảm giá không hợp lệ hoặc không tìm thấy.');
      if (activeCartId) {
        setPendingCartDiscount(activeCartId, 0, null, '');
      } else {
        setVoucher(null);
        setDiscount(0);
      }
    }
  };

  const calculateDiscount = () => {
    return appliedDiscount;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTimeForInvoice = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng đang trống');
      return;
    }
    const totalAmount = calculateCartTotal();
    const cashReceivedNum = parseFloat(cashReceived.toString());

    if (paymentMethod === 'cash' && (isNaN(cashReceivedNum) || cashReceivedNum < totalAmount)) {
      toast.error('Số tiền khách đưa không đủ hoặc không hợp lệ.');
      return;
    }


    setCheckoutIsLoading(true);

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const generatedOrderId = `POS${hours}${minutes}${seconds}`;

    const orderPayload: IPOSOrderCreateRequest = {
      orderId: generatedOrderId,
      customer: customerName || 'Khách tại quầy',
      items: cartItems.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        variant: {
          colorId: item.actualColorId || '',
          sizeId: item.actualSizeId || '',
        }
      })),
      subTotal: calculateCartSubtotal(),
      total: totalAmount,
      shippingAddress: {
        name: customerName || 'Khách vãng lai',
        phoneNumber: customerPhone || 'N/A',
        provinceId: 'N/A',
        districtId: 'N/A',
        wardId: 'N/A',
        specificAddress: 'Tại quầy'
      },
      paymentMethod: paymentMethod === 'cash' ? 'CASH' : 'BANK_TRANSFER',
      orderStatus: "HOAN_THANH",
      discount: appliedDiscount,
      voucher: appliedVoucher?._id || '',
    };

    try {
      const orderResponse = await createOrderMutation.mutateAsync(orderPayload);

      if (orderResponse.success && orderResponse.data) {
        const orderId = orderResponse.data._id;
        const orderCode = orderResponse.data.orderNumber || `POS-${Math.floor(1000 + Math.random() * 9000)}`;

        updateStatsOnCheckout(totalAmount);
        const newTransaction = {
          id: orderCode,
          customer: customerName || 'Khách vãng lai',
          amount: totalAmount,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          status: 'completed'
        };
        setRecentTransactions([newTransaction, ...recentTransactions.slice(0, 2)]);
        toast.success(`Đã tạo đơn hàng ${orderCode} và thanh toán thành công!`);

        if (appliedVoucher) {
          incrementVoucherUsageMutation(
            appliedVoucher._id,
            {
              onSuccess: () => {
                toast.info(`Đã cập nhật lượt sử dụng cho mã giảm giá "${appliedVoucher.code}".`);
              },
              onError: (error: Error) => {
                toast.error(`Lỗi khi cập nhật mã giảm giá: ${error.message}`);
              },
            }
          );
        }

        const currentChangeDue = paymentMethod === 'cash' && !isNaN(cashReceivedNum) && cashReceivedNum >= totalAmount ? cashReceivedNum - totalAmount : 0;
        const invoiceData: InvoiceData = {
          shopInfo: {
            name: 'Street Sneaker',
            address: 'Địa chỉ shop: 20 Hồ Tùng Mậu, Cầu Giấy, Hà Nội',
            phone: '0123 456 789',
            email: 'info@street-sneaker.com'
          },
          customerInfo: {
            name: customerName || 'Khách vãng lai',
            phone: customerPhone || 'N/A',
          },
          orderId: orderCode,
          employee: 'Nhân viên Bán Hàng',
          createdAt: new Date().toISOString(),
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            color: item.colorName,
            size: item.sizeName,
          })),
          subTotal: calculateCartSubtotal(),
          discount: appliedDiscount,
          voucherCode: appliedVoucher?.code,
          total: totalAmount,
          cashReceived: paymentMethod === 'cash' ? cashReceivedNum : totalAmount,
          changeGiven: currentChangeDue,
          paymentMethod: paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản',
        };
        setCurrentInvoiceData(invoiceData);
        setShowInvoiceDialog(true);


        clearCartStore();
        
        // Clear active pending cart if exists
        if (activeCartId) {
          clearPendingCartItems(activeCartId);
        }
        
        setCustomerName('');
        setCustomerPhone('');
        setSelectedUserId('guest');
        setPaymentMethod('cash');
        setCashReceived('');
        setTransferPaymentCompleted(false);
        setShowCheckoutDialog(false);

      } else {
        toast.error((orderResponse as any).message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra trong quá trình thanh toán.');
    } finally {
      setCheckoutIsLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    const itemsToCheck = activeCart?.items || mainCartItems;
    if (itemsToCheck.length === 0) {
      toast.error('Giỏ hàng đang trống');
      return;
    }
    
    // Sync active cart to main cart for checkout
    syncActiveCartToMainCart();
    
    setCashReceived('');
    setSelectedUserId('guest');
    setCustomerName('');
    setCustomerPhone('');
    setTransferPaymentCompleted(false);
    setShowCheckoutDialog(true);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    if (userId && userId !== 'guest' && userId !== 'loading' && userId !== 'no-customers' && usersData?.data?.accounts) {
      const selectedUser = usersData.data.accounts.find((user: IAccount) => user._id === userId);
      if (selectedUser) {
        setCustomerName(selectedUser.fullName);
        setCustomerPhone(selectedUser.phoneNumber || '');
      }
    } else {
      setCustomerName('');
      setCustomerPhone('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        handleProceedToCheckout();
      }

      if (e.altKey && e.key === 'c') {
        if (cartItems.length > 0 || appliedVoucher) {
          // Clear main cart
          clearCartStore();
          
          // Clear active pending cart if exists
          if (activeCartId) {
            clearPendingCartItems(activeCartId);
          }
          
          setSelectedProduct(null);
          setSelectedApiVariant(null);
          toast.success('Đã xóa giỏ hàng và mã giảm giá.');
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
  }, [cartItems, appliedVoucher, handleProceedToCheckout]);

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
        if (!sizeMap.has(variant.sizeId._id)) {
          sizeMap.set(variant.sizeId._id, variant.sizeId);
        }
      }
    });
    return Array.from(sizeMap.values()).filter(Boolean) as NonNullable<ApiVariant['sizeId']>[];
  }, [selectedProduct, selectedApiVariant]);

  // Helper functions for cart calculations
  const calculateCartSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateCartTotal = () => {
    const subtotal = calculateCartSubtotal();
    return Math.max(0, subtotal - appliedDiscount);
  };

  const totalAmount = calculateCartTotal();
  const cashReceivedNum = parseFloat(cashReceived.toString());
  const changeDue = useMemo(() => {
    if (paymentMethod === 'cash' && cashReceived) {
      const cashReceivedNum = parseFloat(cashReceived.toString());
      const total = calculateCartTotal();
      return !isNaN(cashReceivedNum) && cashReceivedNum >= total ? cashReceivedNum - total : 0;
    }
    return 0;
  }, [paymentMethod, cashReceived, calculateCartTotal]);

  // Handle creating new pending cart
  const handleCreateNewCart = () => {
    const newCartId = createNewCart();
    if (!newCartId) {
      toast.warn('Không thể tạo thêm giỏ hàng. Tối đa 5 giỏ hàng chờ!');
      return;
    }
    toast.success(`Đã tạo giỏ hàng mới: Giỏ hàng ${pendingCarts.length + 1}`);
  };

  // Handle deleting a pending cart
  const handleDeleteCart = (cartId: string) => {
    setCartToDelete(cartId);
    setShowDeleteCartDialog(true);
  };

  // Confirm delete cart
  const confirmDeleteCart = () => {
    if (cartToDelete) {
      const cartToDeleteData = pendingCarts.find(cart => cart.id === cartToDelete);
      if (cartToDeleteData) {
        deleteCart(cartToDelete);
        toast.success(`Đã xóa ${cartToDeleteData.name}`);
      }
      setCartToDelete(null);
      setShowDeleteCartDialog(false);
    }
  };

  // Cancel delete cart
  const cancelDeleteCart = () => {
    setCartToDelete(null);
    setShowDeleteCartDialog(false);
  };

  // Handle switching active cart
  const handleSwitchCart = (cartId: string) => {
    setActiveCart(cartId);
    const cart = pendingCarts.find(c => c.id === cartId);
    if (cart) {
      toast.info(`Đã chuyển sang ${cart.name}`);
    }
  };

  // Sync active cart to main cart before checkout
  const syncActiveCartToMainCart = () => {
    if (activeCart) {
      // Clear main cart first
      clearCartStore();
      
      // Add all items from active cart to main cart
      activeCart.items.forEach(item => {
        addToCartStore(item);
      });
      
      // Set discount and voucher
      setDiscount(activeCart.appliedDiscount);
      setVoucher(activeCart.appliedVoucher);
      setCouponCode(activeCart.couponCode);
    }
  };

  // Handle viewing cart items
  const handleViewCartItems = (cartId: string) => {
    setSelectedCartForView(cartId);
    setShowCartItemsDialog(true);
  };

  // Close cart items dialog
  const closeCartItemsDialog = () => {
    setShowCartItemsDialog(false);
    setSelectedCartForView(null);
  };

  return (
    <div className="h-full">

      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bán hàng tại quầy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      
      </div>
        {/* Pending Carts Tabs */}
        <div className='bg-white rounded-[6px] p-4 mb-4 shadow-sm border border-border'>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-maintext flex items-center gap-2">
                <Icon path={mdiCart} size={1} className="text-primary" />
                Giỏ hàng chờ ({pendingCarts.length}/5)
              </h3>
              <Button
                onClick={handleCreateNewCart}
                disabled={pendingCarts.length >= 5}
              >
                <Icon path={mdiInvoicePlus} size={0.7} />
                Thêm mới
              </Button>
            </div>
            
            {pendingCarts.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {pendingCarts.slice(0, 5).map((cart, index) => (
                  <motion.button
                    key={cart.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      'relative flex items-center gap-2 p-2 rounded-sm border-2 transition-all duration-200 min-w-[140px] group',
                      activeCartId === cart.id
                        ? 'border-primary bg-primary/5 text-primary shadow-md'
                        : 'border-border bg-white text-maintext hover:border-primary/50 hover:bg-primary/5'
                    )}
                    onClick={() => handleSwitchCart(cart.id)}
                  >
                    <div className="flex items-center gap-1 flex-1">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        cart.items.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                      )} />
                      <span className="text-sm font-medium truncate">{cart.name} <span className="text-sm text-maintext/70 font-semibold">({cart.items.reduce((sum, item) => sum + item.quantity, 0)})</span></span>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity border border-red-500/70 p-1 hover:bg-red-400 bg-red-400 rounded-full hover:!text-white text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCart(cart.id);
                      }}
                    >
                      <Icon path={mdiClose} size={0.7} className="hover:!text-white" />
                    </button>
                  </motion.button>
                ))}
                
                {pendingCarts.length > 5 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="min-w-[100px] h-[46px] border-2 border-primary/50 flex items-center justify-center text-sm">
                        +{pendingCarts.length - 4} khác
                        <Icon path={mdiChevronDown} size={0.7} className="ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {pendingCarts.slice(4).map((cart) => (
                        <DropdownMenuItem
                          key={cart.id}
                          className="flex items-center justify-between"
                          onClick={() => handleSwitchCart(cart.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              cart.items.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                            )} />
                            <span>{cart.name}</span>
                            {cart.items.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                              </Badge>
                            )}
                          </div>
                          <button
                            className="p-1 hover:bg-red-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCart(cart.id);
                            }}
                          >
                            <Icon path={mdiClose} size={0.4} className="text-red-500" />
                          </button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="bg-white rounded-[6px] p-4 mb-4 shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Icon path={mdiMagnify} size={1} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext" />
                <Input
                  id="product-search"
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-[6px] border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex overflow-x-auto pb-2 scrollbar-thin gap-2">
              {dynamicCategories.map((category) => (
                <button
                  key={category._id}
                  className={cn(
                    'whitespace-nowrap px-4 py-2 rounded-[6px] text-sm font-medium transition-all duration-200',
                    activeCategoryName === category.name
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-50 text-maintext hover:bg-gray-100 hover:text-primary'
                  )}
                  onClick={() => {
                    setActiveCategoryName(category.name);
                    setSelectedProduct(null);
                    setSelectedApiVariant(null);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

        

          <div className="bg-white rounded-xl p-4 flex-1 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 min-h-[400px]">
            {selectedProduct && <div className='w-full flex items-center justify-between mb-4'>
              <motion.button
                className="text-sm text-primary font-medium flex items-center gap-2 hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-full"
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedApiVariant(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon path={mdiChevronLeft} size={0.7} />
                Quay lại danh sách sản phẩm
              </motion.button>
            </div>}
            {selectedProduct && selectedApiVariant ? (
              <div className="mb-4">
                <div className="flex flex-col lg:flex-row gap-8">
                  <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border group">
                      <Image
                        src={checkImageUrl(selectedApiVariant?.images?.[0] || selectedProduct.variants[0]?.images?.[0])}
                        alt={selectedProduct.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={100}
                      />

                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    </div>
                    {selectedApiVariant && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className='w-full mt-4'
                          onClick={addToCart}
                          disabled={selectedApiVariant.stock === 0}
                        >
                          <Icon path={mdiCartPlus} size={0.7} />
                          Thêm vào giỏ hàng POS
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Enhanced Product Information Section */}
                  <motion.div
                    className="lg:w-1/2 space-y-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {/* Product Header */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {getBrandName(selectedProduct.brand)}
                        </Badge>
                        <Badge variant="outline" className="text-maintext">
                          Admin POS
                        </Badge>
                        {/* Badge giảm giá */}
                      </div>

                      <h2 className="text-2xl font-bold text-maintext leading-tight">
                        {selectedProduct.name}
                      </h2>

                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`text-4xl font-bold ${(selectedProduct as any).hasDiscount ? 'text-primary' : 'text-primary'}`}>
                          {formatCurrency((selectedProduct as any).hasDiscount ? (selectedProduct as any).discountedPrice : selectedApiVariant.price)}
                        </div>
                        {(selectedProduct as any).hasDiscount && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl text-maintext line-through">
                              {formatCurrency((selectedProduct as any).originalPrice)}
                            </span>
                            <Badge variant="destructive" className="bg-green-500">
                              -{(selectedProduct as any).discountPercent}% OFF
                            </Badge>
                          </div>
                        )}
                      </motion.div>
                    </div>
                    {/* Enhanced Color Selection */}
                    {uniqueColorsForSelectedProduct.length > 0 && (
                      <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Icon path={mdiPalette} size={1} className="text-primary" />
                          <h3 className="text-base font-semibold text-maintext">Màu sắc</h3>
                          {selectedApiVariant?.colorId && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {selectedApiVariant.colorId.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-4 flex-wrap">
                          {uniqueColorsForSelectedProduct.map((color) => (
                            <motion.button
                              key={color._id}
                              className={cn(
                                'relative group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 border-2',
                                selectedApiVariant?.colorId?._id === color._id
                                  ? 'border-primary ring-4 ring-primary/20 scale-110'
                                  : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                              )}
                              style={{ backgroundColor: color.code }}
                              onClick={() => handleColorSelectFromDetail(color._id)}
                              title={color.name}
                              whileHover={{ scale: selectedApiVariant?.colorId?._id === color._id ? 1.1 : 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {selectedApiVariant?.colorId?._id === color._id && (
                                <Icon
                                  path={mdiCheck}
                                  size={1}
                                  className="text-white drop-shadow-lg"
                                />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {/* Enhanced Size Selection */}
                    {availableSizesForSelectedColor.length > 0 && selectedApiVariant?.colorId && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Icon path={mdiRuler} size={1} className="text-primary" />
                          <h3 className="text-base font-semibold text-maintext">Kích thước</h3>
                          {selectedApiVariant?.sizeId && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {selectedApiVariant.sizeId.name || selectedApiVariant.sizeId.value}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {availableSizesForSelectedColor.map((size) => {
                            const variantForThisSize = selectedProduct.variants.find(v => v.colorId?._id === selectedApiVariant.colorId?._id && v.sizeId?._id === size._id);
                            const stockForThisSize = variantForThisSize?.stock || 0;
                            return (
                              <Button
                                key={size._id}
                                size="icon"
                                variant={selectedApiVariant?.sizeId?._id === size._id ? "default" : "outline"}
                                className={cn(
                                  'transition-all duration-300',
                                  stockForThisSize === 0 && 'opacity-50 cursor-not-allowed'
                                )}
                                onClick={() => handleSizeSelectFromDetail(size._id)}
                                disabled={stockForThisSize === 0}
                              >
                                {size.name || size.value}
                                {stockForThisSize === 0 && ' (Hết hàng)'}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Icon path={mdiPackageVariant} size={1} className="text-primary" />
                      <h3 className="text-base font-semibold text-maintext">Tồn kho</h3>
                      {selectedApiVariant?.sizeId && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {selectedApiVariant.stock}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="grid" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="grid" className="flex items-center gap-1 text-maintext/70">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-maintext"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                      Lưới
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-1 text-maintext/70">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-maintext"><path d="M3 3h18v18H3z" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
                      Bảng
                    </TabsTrigger>
                  </TabsList>

                  <div className="text-sm text-maintext">
                    Hiển thị {apiIsLoading ? <Skeleton className="h-4 w-5 inline-block" /> : processedProducts.length} / {rawData?.data?.pagination?.totalItems || 0} sản phẩm
                  </div>
                </div>

                {apiIsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(pagination.limit)].map((_, index) => (
                      <CardSkeleton key={index} />
                    ))}
                  </div>
                ) : apiIsError ? (
                  <div className="text-center py-10 text-red-500">Lỗi khi tải sản phẩm. Vui lòng thử lại.</div>
                ) : processedProducts.length === 0 ? (
                  <div className="text-center py-10 text-maintext">Không tìm thấy sản phẩm nào.</div>
                ) : (
                  <>
                    <TabsContent value="grid" className="mt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {processedProducts.map((product) => {
                          const firstVariant = product.variants?.[0];
                          const uniqueColorsCount = new Set(product.variants.map(v => v.colorId?._id)).size;
                          return (
                            <motion.div
                              key={product._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-white rounded-[6px] border border-border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
                            >
                              <div
                                className="relative h-48 w-full bg-gray-50 overflow-hidden cursor-pointer"
                                onClick={() => handleProductSelect(product)}
                              >
                                <Image
                                  src={checkImageUrl(firstVariant?.images?.[0])}
                                  alt={product.name}
                                  fill
                                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                  {(product as any).hasDiscount && (
                                    <Badge variant="destructive" className="bg-green-500 text-white">
                                      -{(product as any).discountPercent}% OFF
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="p-4">
                                <h3
                                  className="font-medium text-maintext group-hover:text-primary transition-colors truncate cursor-pointer"
                                  onClick={() => handleProductSelect(product)}
                                >
                                  {product.name}
                                </h3>
                                <p className="text-maintext text-sm mb-2 truncate">{getBrandName(product.brand)}</p>
                                <div className="flex justify-between items-center">
                                  <div className="flex flex-col">
                                    <p className={`font-medium ${(product as any).hasDiscount ? 'text-primary' : 'text-primary'}`}>
                                      {firstVariant ? formatCurrency((product as any).hasDiscount ? (product as any).discountedPrice : firstVariant.price) : 'N/A'}
                                    </p>
                                    {(product as any).hasDiscount && (
                                      <p className="text-xs text-maintext line-through">
                                        {formatCurrency((product as any).originalPrice)}
                                      </p>
                                    )}
                                  </div>
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
                                        <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-maintext">
                                          +{uniqueColorsCount - 3}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  className="w-full mt-3 flex items-center justify-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const firstAvailableVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
                                    if (firstAvailableVariant) {
                                      if (firstAvailableVariant.stock > 0) {
                                        addItemToCorrectCart(product, firstAvailableVariant);
                                      } else {
                                        toast.warn('Sản phẩm này đã hết hàng.');
                                      }
                                    } else {
                                      toast.warn('Sản phẩm này không có biến thể hoặc đã hết hàng.');
                                    }
                                  }}
                                  disabled={product.variants.every(v => v.stock === 0)}
                                >
                                  <Icon path={mdiPlus} size={0.7} />
                                  Thêm vào giỏ
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="table" className="mt-0">
                      <div className="border border-border rounded-[6px] overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="text-left py-3 px-4 font-medium text-maintext">Sản phẩm</th>
                              <th className="text-left py-3 px-4 font-medium text-maintext">Thương hiệu</th>
                              <th className="text-left py-3 px-4 font-medium text-maintext">Giá</th>
                              <th className="text-left py-3 px-4 font-medium text-maintext">Màu sắc</th>
                              <th className="text-left py-3 px-4 font-medium text-maintext">Kho</th>
                              <th className="text-center py-3 px-4 font-medium text-maintext">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {processedProducts.map((product) => {
                              const firstVariant = product.variants?.[0];
                              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                              const uniqueColorsCount = new Set(product.variants.map(v => v.colorId?._id)).size;
                              const firstAvailableVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
                              return (
                                <tr
                                  key={product._id}
                                  className="border-t border-border hover:bg-muted/20 transition-colors cursor-pointer"
                                >
                                  <td className="py-3 px-4" onClick={() => handleProductSelect(product)}>
                                    <div className="flex items-center gap-2">
                                      <div className="relative h-10 w-10 rounded-[6px] overflow-hidden bg-gray-50">
                                        <Image
                                          src={checkImageUrl(firstVariant?.images?.[0])}
                                          alt={product.name}
                                          fill
                                          className="object-contain"
                                        />
                                      </div>
                                      <span className="font-medium text-maintext truncate max-w-[150px]">{product.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-maintext truncate max-w-[100px]" onClick={() => handleProductSelect(product)}>{getBrandName(product.brand)}</td>
                                  <td className="py-3 px-4" onClick={() => handleProductSelect(product)}>
                                    <div className="flex flex-col">
                                      <span className={`font-medium ${(product as any).hasDiscount ? 'text-primary' : 'text-primary'}`}>
                                        {firstVariant ? formatCurrency((product as any).hasDiscount ? (product as any).discountedPrice : firstVariant.price) : 'N/A'}
                                      </span>
                                      {(product as any).hasDiscount && (
                                        <span className="text-xs text-maintext line-through">
                                          {formatCurrency((product as any).originalPrice)}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4" onClick={() => handleProductSelect(product)}>
                                    {product.variants.length > 0 && (
                                      <div className="flex -space-x-1">
                                        {Array.from(new Map(product.variants.map(v => [v.colorId?._id, v.colorId])).values()).slice(0, 3).map((color, idx) => color && (
                                          <div
                                            key={color._id || idx}
                                            className="h-5 w-5 rounded-full border"
                                            style={{ backgroundColor: color.code }}
                                            title={color.name}
                                          />
                                        ))}
                                        {uniqueColorsCount > 3 && (
                                          <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-maintext">
                                            +{uniqueColorsCount - 3}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-3 px-4" onClick={() => handleProductSelect(product)}>
                                    <Badge variant={totalStock > 10 ? "secondary" : totalStock > 0 ? "outline" : "destructive"} className="text-xs !flex-shrink-0">
                                      <span className="flex-shrink-0">{totalStock > 10 ? "Còn hàng" : totalStock > 0 ? "Sắp hết" : "Hết hàng"}</span>
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductSelect(product);
                                              }}
                                            >
                                              <Icon path={mdiInformationOutline} size={0.7} className="text-maintext" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Chi tiết</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              disabled={product.variants.every(v => v.stock === 0)}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (firstAvailableVariant) {
                                                  if (firstAvailableVariant.stock > 0) {
                                                    addItemToCorrectCart(product, firstAvailableVariant);
                                                  } else {
                                                    toast.warn('Sản phẩm này đã hết hàng.');
                                                  }
                                                }
                                              }}
                                            >
                                              <Icon path={mdiPlus} size={0.7} className="text-maintext" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Thêm vào giỏ</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    {dataWithPromotions?.data?.pagination && dataWithPromotions.data.pagination.totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (pagination.page > 1) {
                                    setPagination(p => ({ ...p, page: p.page - 1 }));
                                  }
                                }}
                                disabled={pagination.page <= 1}
                              />
                            </PaginationItem>
                            {(() => {
                              const pages = [];
                              const totalPages = dataWithPromotions.data.pagination.totalPages;
                              const currentPage = pagination.page;
                              const pageLimit = 5;

                              if (totalPages <= pageLimit) {
                                for (let i = 1; i <= totalPages; i++) {
                                  pages.push(
                                    <PaginationItem key={i}>
                                      <PaginationLink
                                        href="#"
                                        isActive={currentPage === i}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPagination(p => ({ ...p, page: i }));
                                        }}
                                      >
                                        {i}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                }
                              } else {
                                pages.push(
                                  <PaginationItem key={1}>
                                    <PaginationLink
                                      href="#"
                                      isActive={currentPage === 1}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPagination(p => ({ ...p, page: 1 }));
                                      }}
                                    >
                                      1
                                    </PaginationLink>
                                  </PaginationItem>
                                );

                                if (currentPage > 3) {
                                  pages.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
                                }

                                let startPage = Math.max(2, currentPage - 1);
                                let endPage = Math.min(totalPages - 1, currentPage + 1);

                                if (currentPage <= 2) {
                                  endPage = Math.min(totalPages - 1, 3);
                                }
                                if (currentPage >= totalPages - 1) {
                                  startPage = Math.max(2, totalPages - 2);
                                }

                                for (let i = startPage; i <= endPage; i++) {
                                  pages.push(
                                    <PaginationItem key={i}>
                                      <PaginationLink
                                        href="#"
                                        isActive={currentPage === i}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPagination(p => ({ ...p, page: i }));
                                        }}
                                      >
                                        {i}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                }

                                if (currentPage < totalPages - 2) {
                                  pages.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
                                }

                                pages.push(
                                  <PaginationItem key={totalPages}>
                                    <PaginationLink
                                      href="#"
                                      isActive={currentPage === totalPages}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPagination(p => ({ ...p, page: totalPages }));
                                      }}
                                    >
                                      {totalPages}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              }
                              return pages;
                            })()}
                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (pagination.page < (dataWithPromotions?.data?.pagination?.totalPages || 1)) {
                                    setPagination(p => ({ ...p, page: p.page + 1 }));
                                  }
                                }}
                                disabled={pagination.page >= (dataWithPromotions?.data?.pagination?.totalPages || 1)}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </Tabs>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 w-full justify-between">
              {activeCart ? (
                <div className="flex items-center gap-2">
                  <span>{activeCart.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                  </Badge>
                </div>
              ) : (
                'Giỏ hàng chính'
              )}
              
              {pendingCarts.length > 4 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Icon path={mdiCart} size={0.7} />
                      <Icon path={mdiChevronDown} size={0.7} className="ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {pendingCarts.map((cart) => (
                      <DropdownMenuItem
                        key={cart.id}
                        className="flex items-center justify-between"
                        onClick={() => handleSwitchCart(cart.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            cart.items.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                          )} />
                          <span>{cart.name}</span>
                          {cart.items.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                            </Badge>
                          )}
                        </div>
                        <button
                          className="p-1 hover:bg-red-100 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCart(cart.id);
                          }}
                        >
                          <Icon path={mdiClose} size={0.4} className="text-red-500" />
                        </button>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-maintext">
                <Icon path={mdiCart} size={2} className="mx-auto mb-2 text-gray-300" />
                <p>Giỏ hàng trống</p>
                <p className="text-sm text-maintext">Thêm sản phẩm để bắt đầu</p>
              </div>
            ) : (
              <>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center gap-2"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-white">
                          <Image
                            src={checkImageUrl(item.image)}
                            alt={item.name}
                            height={100}
                            width={100}
                            draggable={false}
                            className="object-contain h-full w-full flex-shrink-0"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-maintext truncate text-wrap">{item.name}</h4>
                          <p className="text-xs text-maintext">
                            {item.colorName} / {item.sizeName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg text-primary font-semibold">
                              {formatCurrency(item.price)}
                            </span>
                            {item.hasDiscount && item.originalPrice && (
                              <span className="text-sm text-maintext line-through">
                                {formatCurrency(item.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateCartItemQuantity(item.id, -1)}
                          >
                            <Icon path={mdiMinus} size={0.7} />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 0;
                              if (newQuantity < 0) {
                                toast.warn('Số lượng không được âm.');
                                return;
                              }
                              if (newQuantity > item.stock) {
                                toast.warn(`Chỉ còn ${item.stock} sản phẩm trong kho.`);
                                return;
                              }
                              if (newQuantity === 0) {
                                removeCartItem(item.id);
                                return;
                              }
                              // Calculate the difference and update
                              const difference = newQuantity - item.quantity;
                              if (difference !== 0) {
                                updateCartItemQuantity(item.id, difference);
                              }
                            }}
                            onBlur={(e) => {
                              // Ensure we have a valid number on blur
                              const value = e.target.value;
                              if (value === '' || isNaN(parseInt(value))) {
                                // Reset to current quantity if invalid
                                e.target.value = item.quantity.toString();
                              }
                            }}
                            className="w-16 h-8 text-center text-sm"
                            min="1"
                            max={item.stock}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateCartItemQuantity(item.id, 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Icon path={mdiPlus} size={0.7} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 bg-red-50 border border-red-500"
                            onClick={() => removeCartItem(item.id)}
                          >
                            <Icon path={mdiDelete} size={0.7} />
                          </Button>
                        </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Voucher Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Nhập mã giảm giá..."
                      value={couponCode}
                      onChange={(e) => {
                        if (activeCartId) {
                          // Update coupon code in pending cart
                          const activeCart = getActiveCart();
                          if (activeCart) {
                            setPendingCartDiscount(activeCartId, activeCart.appliedDiscount, activeCart.appliedVoucher, e.target.value);
                          }
                        } else {
                          setCouponCode(e.target.value);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="default"
                      onClick={applyCoupon}
                      disabled={!couponCode || isFetchingVoucher}
                    >
                      {isFetchingVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
                    </Button>
                  </div>
                  <Button
                    variant="link"
                    className="text-sm text-primary mt-1 px-0"
                    onClick={() => setShowVouchersDialog(true)}
                  >
                    Xem danh sách mã giảm giá
                  </Button>

                  {appliedVoucher && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Icon path={mdiTag} size={0.7} className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Mã: {appliedVoucher.code}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                        onClick={() => {
                          if (activeCartId) {
                            setPendingCartDiscount(activeCartId, 0, null, '');
                          } else {
                            setDiscount(0);
                            setVoucher(null);
                            setCouponCode('');
                          }
                        }}
                      >
                        <Icon path={mdiClose} size={0.7} />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(calculateCartSubtotal())}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(appliedDiscount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{formatCurrency(calculateCartTotal())}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleProceedToCheckout}
                  disabled={cartItems.length === 0}
                >
                  <Icon path={mdiCashRegister} size={0.7} className="mr-2" />
                  Thanh toán ({formatCurrency(calculateCartTotal())})
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-4xl">
          <ScrollArea className="max-h-[70vh] p-1">
            <DialogHeader>
              <DialogTitle>Xác nhận thanh toán</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label htmlFor="user-select" className="text-right text-sm text-maintext cursor-help font-semibold">
                        Chọn khách hàng
                      </label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p>Chọn khách hàng có sẵn hoặc để trống để nhập thủ công</p>
                        {usersData?.data?.accounts && (
                          <p className="text-xs text-gray-400 mt-1">
                            Có {usersData.data.accounts.length} khách hàng trong hệ thống
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select
                  value={selectedUserId}
                  onValueChange={handleUserSelect}
                >
                  <SelectTrigger className="col-span-3 h-12">
                    <SelectValue placeholder={`Chọn khách hàng (${usersData?.data?.accounts?.length || 0} khách hàng)`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guest">
                      <div className="flex items-center gap-4 py-1">
                        <Icon path={mdiAccount} size={0.7} className="text-gray-400" />
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-maintext font-semibold">Khách vãng lai</span>
                          <span className="text-xs text-maintext">Nhập thông tin thủ công</span>
                        </div>
                      </div>
                    </SelectItem>
                    {isLoadingUsers ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-4 py-2">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-300 border-t-blue-600 rounded-full"></div>
                          <span className="text-maintext">Đang tải danh sách khách hàng...</span>
                        </div>
                      </SelectItem>
                    ) : usersData?.data?.accounts && usersData.data.accounts.length > 0 ? (
                      usersData.data.accounts.map((user: IAccount) => (
                        <SelectItem key={user._id} value={user._id}>
                          <div className="flex items-center gap-4 py-1">
                            <Icon path={mdiAccount} size={0.7} className="text-primary" />
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-primary font-semibold truncate">{user.fullName}</span>
                                {(user as any).code && (
                                  <span className="px-2 py-0.5 text-xs font-mono bg-green-50 text-green-600 rounded border border-green-200">
                                    {(user as any).code}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-maintext mt-0.5">
                                {user.phoneNumber ? (
                                  <span className="flex items-center gap-1 text-maintext">
                                    📱 {user.phoneNumber}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-maintext">
                                    ✉️ {user.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-customers" disabled>
                        <div className="flex items-center gap-4 py-2">
                          <Icon path={mdiAccount} size={0.7} className="text-gray-400" />
                          <div className="flex flex-col">
                            <span className="text-maintext font-medium">Không có khách hàng nào</span>
                            <span className="text-xs text-gray-400">Vui lòng thêm khách hàng mới</span>
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="customer-name" className="text-right text-sm text-maintext font-semibold">
                  Tên khách hàng
                </label>
                <Input
                  id="customer-name"
                  placeholder="Tên khách hàng"
                  className="col-span-3"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    // Nếu người dùng nhập thủ công thì reset selected user
                    if (selectedUserId && selectedUserId !== 'guest') {
                      setSelectedUserId('guest');
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="customer-phone" className="text-right text-sm text-maintext font-semibold">
                  Số điện thoại
                </label>
                <Input
                  id="customer-phone"
                  placeholder="Số điện thoại"
                  className="col-span-3"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    // Nếu người dùng nhập thủ công thì reset selected user
                    if (selectedUserId && selectedUserId !== 'guest') {
                      setSelectedUserId('guest');
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="payment-method" className="text-right text-sm text-maintext font-semibold">
                  Thanh toán
                </label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value) => {
                    setPaymentMethod(value);
                    setTransferPaymentCompleted(false);
                    if (value === 'transfer') {
                      setCashReceived(calculateCartTotal().toString());
                    } else {
                      setCashReceived('');
                    }
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn phương thức thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      <div className="flex items-center gap-2">
                        <Icon path={mdiCashMultiple} size={0.7} className="text-maintext" />
                        <span>Tiền mặt</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="transfer">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-maintext"><path d="M4 10V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4" /><polyline points="14 2 14 8 20 8" /><path d="m10 18 3-3-3-3" /><path d="M4 18v-1a2 2 0 0 1 2-2h6" /></svg>
                        <span>Chuyển khoản</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === 'cash' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="cash-received" className="text-right text-sm text-maintext font-semibold">
                    Tiền khách đưa
                  </label>
                  <Input
                    id="cash-received"
                    type="number"
                    placeholder="Nhập số tiền khách đưa"
                    className="col-span-3"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    min={0}
                  />
                </div>
              )}

              {paymentMethod === 'transfer' && (
                <div className="grid grid-cols-1 gap-4">
                  <div
                    className="bg-gray-50 rounded-lg p-4 text-center"
                    onClick={() => {
                      if (!transferPaymentCompleted) {
                        setTransferPaymentCompleted(true);
                        setShowPaymentSuccessModal(true);
                      }
                    }}
                    style={{ cursor: !transferPaymentCompleted ? 'pointer' : 'default' }}
                  >
                    <h3 className="text-lg font-semibold mb-4 text-maintext">Quét mã QR để thanh toán</h3>
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <QRCodeComponent
                          value={`BANK_TRANSFER|970415|0123456789|STREET SNEAKER|${calculateCartTotal()}|Thanh toan don hang ${new Date().getTime()}`}
                          size={200}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-maintext space-y-1">
                      <p><strong>Ngân hàng:</strong> Vietcombank</p>
                      <p><strong>Số tài khoản:</strong> 0123456789</p>
                      <p><strong>Chủ tài khoản:</strong> STREET SNEAKER</p>
                      <p><strong>Số tiền:</strong> {formatCurrency(calculateCartTotal())}</p>
                      <p><strong>Nội dung:</strong> Thanh toan don hang {new Date().getTime()}</p>
                    </div>
                    {transferPaymentCompleted && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-green-700">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Thanh toán thành công!</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-maintext">
                  <span className="text-maintext text-base">Số lượng sản phẩm:</span>
                  <span className="text-maintext text-base">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-maintext">
                  <span className="text-base">Tạm tính:</span>
                  <span className="text-base">{formatCurrency(calculateCartSubtotal())}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Giảm giá ({appliedVoucher?.code || 'KM'}):</span>
                    <span>-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-base pt-2 border-t border-border">
                  <span className="text-maintext font-semibold">Tổng thanh toán:</span>
                  <span className="text-primary font-semibold">{formatCurrency(calculateCartTotal())}</span>
                </div>
                {paymentMethod === 'cash' && !isNaN(parseFloat(cashReceived.toString())) && parseFloat(cashReceived.toString()) >= calculateCartTotal() && changeDue >= 0 && (
                  <div className="flex justify-between font-medium text-base pt-2">
                    <span className="text-maintext font-semibold">Tiền thừa trả khách:</span>
                    <span className="text-primary font-semibold">{formatCurrency(changeDue)}</span>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className='pb-4'>
              <Button variant="outline" onClick={() => setShowCheckoutDialog(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={checkoutIsLoading ||
                  (paymentMethod === 'cash' && (cashReceived.toString() === '' || parseFloat(cashReceived.toString()) < calculateCartTotal() || isNaN(parseFloat(cashReceived.toString())))) ||
                  (paymentMethod === 'transfer' && !transferPaymentCompleted)}
              >
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
                    <Icon path={mdiCashRegister} size={0.7} className="mr-2" />
                    Hoàn tất thanh toán
                  </>
                )}
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      {showInvoiceDialog && currentInvoiceData && (
        <InvoiceDialog
          open={showInvoiceDialog}
          onOpenChange={setShowInvoiceDialog}
          invoiceData={currentInvoiceData}
          formatCurrency={formatCurrency}
          formatDateTimeForInvoice={formatDateTimeForInvoice}
        />
      )}

      {/* Vouchers Dialog */}
      {showVouchersDialog && (
        <VouchersDialog
          open={showVouchersDialog}
          onOpenChange={setShowVouchersDialog}
          onVoucherSelect={(code: string) => {
            if (activeCartId) {
              const activeCart = getActiveCart();
              if (activeCart) {
                setPendingCartDiscount(activeCartId, activeCart.appliedDiscount, activeCart.appliedVoucher, code);
              }
            } else {
              setCouponCode(code);
            }
            applyCoupon();
          }}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Delete Cart Confirmation Dialog */}
      <Dialog open={showDeleteCartDialog} onOpenChange={setShowDeleteCartDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa giỏ hàng</DialogTitle>
            <DialogDescription>
              {cartToDelete && (
                <>
                  Bạn có chắc chắn muốn xóa "{pendingCarts.find(cart => cart.id === cartToDelete)?.name}"?
                  <br />
                  <span className="text-red-600 font-medium">Hành động này không thể hoàn tác.</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteCart}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCart}>
              <Icon path={mdiDelete} size={0.7} className="mr-2" />
              Xóa giỏ hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Success Modal */}
      <Dialog open={showPaymentSuccessModal} onOpenChange={setShowPaymentSuccessModal}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">Thanh toán thành công!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-maintext mb-2">Giao dịch hoàn tất</h3>
            <p className="text-sm text-maintext text-center mb-4">
              Chúng tôi đã nhận được thanh toán của bạn qua chuyển khoản.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 w-full border">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Số tiền:</span>
                  <span className="font-medium">{formatCurrency(calculateCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phương thức:</span>
                  <span className="font-medium">Chuyển khoản</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => setShowPaymentSuccessModal(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Vouchers Dialog Component
const VouchersDialog = ({
  open,
  onOpenChange,
  onVoucherSelect,
  formatCurrency,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoucherSelect: (code: string) => void;
  formatCurrency: (amount: number) => string;
}) => {
  const { data: vouchersData, isLoading, isError } = useVouchers({ page: 1, limit: 100, status: 'HOAT_DONG' });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`Đã sao chép mã: ${code}`);
      onVoucherSelect(code);
      onOpenChange(false);
    }).catch(err => {
      toast.error('Không thể sao chép mã.');
    });
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const isVoucherExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isVoucherOutOfStock = (voucher: any) => {
    return voucher.quantity - voucher.usedCount <= 0;
  };

  const isVoucherDisabled = (voucher: any) => {
    return isVoucherExpired(voucher.endDate) || isVoucherOutOfStock(voucher);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] flex flex-col ">
        <DialogHeader className="pb-6 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Icon path={mdiTag} size={1} className="text-primary" />
            <span>Danh sách mã giảm giá</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 py-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="grid grid-cols-7 gap-4">
                    {[...Array(7)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 border-b border-border last:border-b-0">
                    <div className="grid grid-cols-7 gap-4 items-center">
                      {[...Array(7)].map((_, j) => (
                        <Skeleton key={j} className="h-6 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <Icon path={mdiTag} size={2} className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">Lỗi khi tải dữ liệu</h3>
              <p className="text-maintext text-center max-w-md">
                Không thể tải danh sách mã giảm giá. Vui lòng kiểm tra kết nối mạng và thử lại.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </div>
          ) : !vouchersData?.data?.vouchers || vouchersData.data.vouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <Icon path={mdiTag} size={2} className="text-maintext" />
              </div>
              <h3 className="text-xl font-semibold text-maintext mb-2">Chưa có mã giảm giá</h3>
              <p className="text-maintext text-center max-w-md">
                Hiện tại không có mã giảm giá nào đang hoạt động trong hệ thống.
              </p>
            </div>
          ) : (
            <div className="py-0">
              {/* Header Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-sm text-maintext">
                    <span className="font-semibold text-primary text-lg">{vouchersData.data.vouchers.length}</span> mã giảm giá
                  </div>
                  <div className="text-sm text-maintext">
                    <span className="font-semibold text-green-600 text-lg">
                      {vouchersData.data.vouchers.filter(v => !isVoucherDisabled(v)).length}
                    </span> khả dụng
                  </div>
                  <div className="text-sm text-maintext">
                    <span className="font-semibold text-red-600 text-lg">
                      {vouchersData.data.vouchers.filter(v => isVoucherDisabled(v)).length}
                    </span> không khả dụng
                  </div>
                </div>
              </div>

              {/* Enhanced Table with shadcn/ui components */}
              <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-white">
                <ScrollArea className="max-h-[50vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Mã giảm giá</TableHead>
                        <TableHead className="w-[200px]">Tên chương trình</TableHead>
                        <TableHead className="text-center w-[80px]">Loại</TableHead>
                        <TableHead className="text-right w-[120px]">Giá trị</TableHead>
                        <TableHead className="text-right w-[150px]">Đơn tối thiểu</TableHead>
                        <TableHead className="text-center w-[80px]">Còn lại</TableHead>
                        <TableHead className="text-center w-[100px]">Hết hạn</TableHead>
                        <TableHead className="text-center w-[150px]">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vouchersData.data.vouchers.map((voucher, index) => {
                        const isExpired = isVoucherExpired(voucher.endDate);
                        const isOutOfStock = isVoucherOutOfStock(voucher);
                        const isDisabled = isVoucherDisabled(voucher);
                        const remainingQuantity = voucher.quantity - voucher.usedCount;

                        return (
                          <motion.tr
                            key={voucher._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={cn(
                              "transition-all duration-200 hover:bg-gray-50/50",
                              isDisabled && "bg-gray-50/30 opacity-75"
                            )}
                          >
                            {/* Voucher Code */}
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "h-2 w-2 rounded-full",
                                  isDisabled ? "bg-red-400" : "bg-green-400"
                                )} />
                                <div>
                                  <div className={cn(
                                    "font-mono font-bold text-sm tracking-wider",
                                    isDisabled ? "text-maintext" : "text-primary"
                                  )}>
                                    {voucher.code}
                                  </div>
                                  <div className="text-xs text-maintext">
                                    ID: {voucher._id.slice(-6)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Program Name */}
                            <TableCell>
                              <div className={cn(
                                "font-medium text-sm leading-tight",
                                isDisabled ? "text-maintext" : "text-maintext"
                              )}>
                                {voucher.name}
                              </div>
                              <div className="text-xs text-maintext mt-1">
                                Đã dùng: {voucher.usedCount}/{voucher.quantity}
                              </div>
                            </TableCell>

                            {/* Type */}
                            <TableCell className="text-center">
                              <Badge
                                variant={voucher.type === 'PERCENTAGE' ? 'default' : 'secondary'}
                                className={cn(
                                  "text-xs",
                                  voucher.type === 'PERCENTAGE'
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : "bg-purple-100 text-purple-700 border-purple-200"
                                )}
                              >
                                {voucher.type === 'PERCENTAGE' ? '%' : 'VNĐ'}
                              </Badge>
                            </TableCell>

                            {/* Value */}
                            <TableCell className="text-right">
                              <div className={cn(
                                "font-bold text-sm",
                                isDisabled ? "text-maintext" : "text-primary"
                              )}>
                                {voucher.type === 'PERCENTAGE' ? `${voucher.value}%` : formatCurrency(voucher.value)}
                              </div>
                              {voucher.type === 'PERCENTAGE' && (voucher as any).maxValue && (
                                <div className="text-xs text-maintext">
                                  Max: {formatCurrency((voucher as any).maxValue)}
                                </div>
                              )}
                            </TableCell>

                            {/* Min Order */}
                            <TableCell className="text-right">
                              <div className="font-semibold text-sm text-maintext">
                                {formatCurrency(voucher.minOrderValue)}
                              </div>
                            </TableCell>

                            {/* Remaining */}
                            <TableCell className="text-center">
                              <Badge
                                variant={remainingQuantity <= 5 ? 'destructive' : remainingQuantity <= 20 ? 'outline' : 'secondary'}
                                className={cn(
                                  "text-xs font-semibold",
                                  remainingQuantity <= 5
                                    ? "bg-red-100 text-red-700 border-red-200"
                                    : remainingQuantity <= 20
                                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                      : "bg-green-100 text-green-700 border-green-200"
                                )}
                              >
                                {remainingQuantity}
                              </Badge>
                            </TableCell>

                            {/* Expiry */}
                            <TableCell className="text-center">
                              <div className={cn(
                                "text-xs font-medium",
                                isExpired ? "text-red-600" : "text-maintext"
                              )}>
                                {formatDate(voucher.endDate)}
                              </div>
                              {isExpired && (
                                <Badge variant="destructive" className="text-xs mt-1">
                                  Hết hạn
                                </Badge>
                              )}
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-center">
                              <motion.div
                                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                              >
                                <Button
                                  size="sm"
                                  className={cn(
                                    "px-4 py-2 text-xs font-semibold transition-all duration-200",
                                    isDisabled
                                      ? "bg-gray-200 text-maintext cursor-not-allowed hover:bg-gray-200"
                                      : "bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white shadow-md hover:shadow-lg"
                                  )}
                                  onClick={() => !isDisabled && handleCopyCode(voucher.code)}
                                  disabled={isDisabled}
                                >
                                  <Icon path={mdiContentCopy} size={0.6} className="mr-1.5" />
                                  {isExpired ? "Hết hạn" : isOutOfStock ? "Hết lượt" : "Chọn mã"}
                                </Button>
                              </motion.div>

                              {isDisabled && (
                                <div className="text-xs text-red-500 mt-1 font-medium">
                                  {isExpired ? "Đã hết hạn" : "Hết lượt sử dụng"}
                                </div>
                              )}
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>

              {/* Footer Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-border">
                <div className="flex items-center justify-between text-sm text-maintext">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span>Khả dụng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-400" />
                      <span>Không khả dụng</span>
                    </div>
                  </div>
                  <div className="text-xs text-maintext">
                    Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-8 py-2 font-medium"
          >
            <Icon path={mdiChevronLeft} size={0.7} className="mr-2" />
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Invoice Dialog Component
const InvoiceDialog = ({
  open,
  onOpenChange,
  invoiceData,
  formatCurrency,
  formatDateTimeForInvoice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: InvoiceData | null;
  formatCurrency: (amount: number) => string;
  formatDateTimeForInvoice: (dateString: string) => string;
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!invoiceData) return null;

  const handlePrintToPdf = async () => {
    try {
      setIsProcessing(true);

      const input = invoiceRef.current;
      if (!input) throw new Error("Invoice element not found");

      const canvas = await toPng(input, {
        quality: 0.95,
        pixelRatio: 2,
        skipAutoScale: true,
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(canvas);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(canvas, 'PNG', 0, 0, pageWidth, imgHeight);
      pdf.save(`HoaDon_${invoiceData.orderId.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      
      toast.success("Đã lưu hoá đơn PDF thành công!");
    } catch (error) {
      toast.error("Lỗi khi in hoá đơn PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col min-h-0">
        <DialogHeader>
          <DialogTitle className="text-maintext text-center text-2xl font-semibold">Hoá đơn bán hàng</DialogTitle>
        </DialogHeader>
        <CustomScrollArea className="flex-1 min-h-0 p-4 overflow-y-auto">
          <div ref={invoiceRef} className="p-4 bg-white" id="invoice-content">
            <div className='w-full justify-center mb-4'>
              <Image
                quality={100}
                draggable={false}
                src="/images/logo.svg" 
                alt="logo" 
                width={100} 
                height={100} 
                className="w-auto mx-auto h-20" 
              />
            </div>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">{invoiceData.shopInfo.name}</h2>
              <p className="text-sm">{invoiceData.shopInfo.address}</p>
              <p className="text-sm">ĐT: {invoiceData.shopInfo.phone} - Email: {invoiceData.shopInfo.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p><strong>Mã HĐ:</strong> {invoiceData.orderId}</p>
                <p><strong>Ngày:</strong> {formatDateTimeForInvoice(invoiceData.createdAt)}</p>
                <p><strong>Nhân viên:</strong> {invoiceData.employee}</p>
              </div>
              <div className="text-right">
                <p><strong>Khách hàng:</strong> {invoiceData.customerInfo.name}</p>
                <p><strong>Điện thoại:</strong> {invoiceData.customerInfo.phone}</p>
              </div>
            </div>

            <Table className="mb-4 text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px] text-center">STT</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-xs">Màu/Size</TableHead>
                  <TableHead className="text-right w-[50px]">SL</TableHead>
                  <TableHead className="text-right w-[100px]">Đơn giá</TableHead>
                  <TableHead className="text-right w-[100px]">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs">{item.color} / {item.size}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end mb-4">
              <div className="w-full max-w-sm space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng:</span>
                  <span>{formatCurrency(invoiceData.subTotal)}</span>
                </div>
                {invoiceData.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Giảm giá ({invoiceData.voucherCode || 'KM'}):</span>
                    <span>-{formatCurrency(invoiceData.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>TỔNG THANH TOÁN:</span>
                  <span className="text-primary">{formatCurrency(invoiceData.total)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Phương thức:</span>
                  <span>{invoiceData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiền khách đưa:</span>
                  <span>{formatCurrency(invoiceData.cashReceived)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiền thừa:</span>
                  <span>{formatCurrency(invoiceData.changeGiven)}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm mt-8">Cảm ơn Quý khách và hẹn gặp lại!</p>
            <p className="text-center text-xs mt-1">Website: {invoiceData.shopInfo.name.toLowerCase().replace(/ /g, '')}.vn</p>
          </div>
        </CustomScrollArea>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button>
          <Button onClick={handlePrintToPdf} disabled={isProcessing}>
            <Icon path={mdiPrinter} size={0.7} className="mr-2" />
            {isProcessing ? 'Đang xử lý...' : 'Lưu PDF & In'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
