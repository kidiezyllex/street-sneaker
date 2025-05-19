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
  mdiQrcodeScan,
  mdiCreditCardOutline,
  mdiCashMultiple,
  mdiReceiptOutline,
  mdiClockOutline,
  mdiInformationOutline,
  mdiReceipt,
  mdiClock,
  mdiAccount,
  mdiContentCopy,
  mdiPrinter
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
import { IProductFilter } from '@/interface/request/product';
import { usePosStore } from '@/stores/posStore'; 
import { useCreatePOSOrder } from '@/hooks/order'; 
import { IPOSOrderCreateRequest } from '@/interface/request/order'; 

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RobotoRegular } from "@/fonts/Roboto-Regular";
import { CustomScrollArea } from '@/components/ui/custom-scroll-area';
import { toPng } from 'html-to-image';
import { useRef } from 'react';

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
  actualColorId?: string; 
  actualSizeId?: string; 
}

interface IVoucherData { 
  _id: string;
  code: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  quantity: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  minOrderValue: number;
  status: string;
  maxValue?: number; 
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
  
  const [cartItems, setCartItems] = useState<UpdatedCartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [checkoutIsLoading, setCheckoutIsLoading] = useState<boolean>(false); 
  const [pagination, setPagination] = useState({ page: 1, limit: 6 }); 
  const [filters, setFilters] = useState<IProductFilter>({ status: 'HOAT_DONG' });
  const [sortOption, setSortOption] = useState<string>('newest'); 
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeCategoryName, setActiveCategoryName] = useState<string>('Tất cả sản phẩm');
  const [showVouchersDialog, setShowVouchersDialog] = useState<boolean>(false); 
  const [appliedVoucher, setAppliedVoucher] = useState<IVoucherData | null>(null); 

  const [cashReceived, setCashReceived] = useState<number | string>('');
  const [showInvoiceDialog, setShowInvoiceDialog] = useState<boolean>(false);
  const [currentInvoiceData, setCurrentInvoiceData] = useState<InvoiceData | null>(null);

  const stats = usePosStore((state) => state.stats); 
  const updateStatsOnCheckout = usePosStore((state) => state.updateStatsOnCheckout); 
  const createOrderMutation = useCreatePOSOrder(); 

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 'TX-1234', customer: 'Nguyễn Văn A', amount: 1250000, time: '10:25', status: 'completed' },
    { id: 'TX-1233', customer: 'Trần Thị B', amount: 850000, time: '09:40', status: 'completed' },
    { id: 'TX-1232', customer: 'Lê Văn C', amount: 2100000, time: '09:15', status: 'pending' }
  ]);

  const { mutate: incrementVoucherUsageMutation } = useIncrementVoucherUsage();

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
    isLoading: apiIsLoading, 
    isError: apiIsError,
  } = isSearching ? searchQueryHook : productsQuery;

  const processedProducts = useMemo(() => {
    let productsToProcess = (rawData?.data?.products || []) as ApiProduct[];

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
        rawData.data.products.forEach((p: ApiProduct) => { 
            if (p.category && typeof p.category === 'object' && p.category._id && p.category.name) {
                uniqueCatObjects.set(p.category._id, { _id: p.category._id, name: p.category.name });
            } else if (typeof p.category === 'string') { 
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
        actualColorId: colorId?._id, 
        actualSizeId: sizeId?._id,   
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
        if (newQuantity <= 0) return item; 
        if (newQuantity > item.stock) {
            toast.warn(`Chỉ còn ${item.stock} sản phẩm trong kho.`);
            return {...item, quantity: item.stock };
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0); 
    setCartItems(updatedItems);
    if(appliedVoucher) {
        const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (subtotal < appliedVoucher.minOrderValue) {
            toast.warn(`Đơn hàng không còn đủ điều kiện cho mã "${appliedVoucher.code}". Đã xóa mã.`);
            setAppliedVoucher(null);
            setAppliedDiscount(0);
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
            setAppliedDiscount(newDiscountAmount);
        }
    }
  };

  const removeCartItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    if(appliedVoucher) {
        const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (subtotal < appliedVoucher.minOrderValue || updatedItems.length === 0) {
            toast.warn(`Đơn hàng không còn đủ điều kiện cho mã "${appliedVoucher.code}" hoặc giỏ hàng trống. Đã xóa mã.`);
            setAppliedVoucher(null);
            setAppliedDiscount(0);
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
            setAppliedDiscount(newDiscountAmount);
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
      setAppliedVoucher(null);
      setAppliedDiscount(0);
      return;
    }

    const voucher = voucherDataResult?.data?.vouchers?.[0];

    if (voucher) {
      const subtotal = calculateSubtotal();
      if (subtotal < voucher.minOrderValue) {
        toast.error(`Đơn hàng chưa đạt giá trị tối thiểu ${formatCurrency(voucher.minOrderValue)} để áp dụng mã này.`);
        setAppliedVoucher(null);
        setAppliedDiscount(0);
        return;
      }

      if (voucher.quantity <= voucher.usedCount) {
        toast.error('Mã giảm giá này đã hết lượt sử dụng.');
        setAppliedVoucher(null);
        setAppliedDiscount(0);
        return;
      }
      
      if (new Date(voucher.endDate) < new Date()) {
        toast.error('Mã giảm giá đã hết hạn.');
        setAppliedVoucher(null);
        setAppliedDiscount(0);
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

      setAppliedDiscount(discountAmount); 
      setAppliedVoucher(voucher); 
      toast.success(`Đã áp dụng mã giảm giá "${voucher.code}".`);
    } else {
      toast.error('Mã giảm giá không hợp lệ hoặc không tìm thấy.');
      setAppliedVoucher(null);
      setAppliedDiscount(0);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    return appliedDiscount;
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
    const totalAmount = calculateTotal();
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
      subTotal: calculateSubtotal(),
      total: totalAmount,
      shippingAddress: {
        name: customerName || 'Khách lẻ',
        phoneNumber: customerPhone || 'N/A',
        provinceId: 'N/A',
        districtId: 'N/A',
        wardId: 'N/A',
        specificAddress: 'Tại quầy'
      },
      paymentMethod: paymentMethod === 'cash' ? 'CASH' :
                     (paymentMethod === 'card' || paymentMethod === 'transfer') ? 'BANK_TRANSFER' : 'CASH',
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
          customer: customerName || 'Khách lẻ',
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
            address: '1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP.HCM',
            phone: '0123 456 789',
            email: 'contact@streetsneaker.vn'
          },
          customerInfo: {
            name: customerName || 'Khách lẻ',
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
          subTotal: calculateSubtotal(),
          discount: appliedDiscount,
          voucherCode: appliedVoucher?.code,
          total: totalAmount,
          cashReceived: paymentMethod === 'cash' ? cashReceivedNum : totalAmount,
          changeGiven: currentChangeDue,
          paymentMethod: paymentMethod === 'cash' ? 'Tiền mặt' : paymentMethod === 'card' ? 'Thẻ tín dụng' : 'Chuyển khoản',
        };
        setCurrentInvoiceData(invoiceData);
        setShowInvoiceDialog(true);


        setCartItems([]);
        setAppliedDiscount(0);
        setCouponCode('');
        setAppliedVoucher(null);
        setCustomerName('');
        setCustomerPhone('');
        setPaymentMethod('cash');
        setCashReceived('');
        setShowCheckoutDialog(false);

      } else {
        toast.error((orderResponse as any).message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra trong quá trình thanh toán.');
    } finally {
      setCheckoutIsLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng đang trống');
      return;
    }
    setCashReceived('');
    setShowCheckoutDialog(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        handleProceedToCheckout();
      }
      
      if (e.altKey && e.key === 'c') {
        if (cartItems.length > 0 || appliedVoucher) {
          setCartItems([]);
          setSelectedProduct(null);
          setSelectedApiVariant(null);
          setAppliedVoucher(null);
          setAppliedDiscount(0);
          setCouponCode('');
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
        if(!sizeMap.has(variant.sizeId._id)){
            sizeMap.set(variant.sizeId._id, variant.sizeId);
        }
      }
    });
    return Array.from(sizeMap.values()).filter(Boolean) as NonNullable<ApiVariant['sizeId']>[];
  }, [selectedProduct, selectedApiVariant]);

  const totalAmount = calculateTotal();
  const cashReceivedNum = parseFloat(cashReceived.toString());
  const changeDue = paymentMethod === 'cash' && !isNaN(cashReceivedNum) && cashReceivedNum >= totalAmount ? cashReceivedNum - totalAmount : 0;

  return (
    <div className="h-full">
      
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
        
        <div className="lg:col-span-2 overflow-hidden flex flex-col">
          
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
            
            
            <div className="flex overflow-x-auto pb-2 scrollbar-thin gap-2">
              {dynamicCategories.map((category) => (
                <button
                  key={category._id}
                  className={cn(
                    'whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    activeCategoryName === category.name 
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-primary'
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
          
          
          <div className="bg-white rounded-lg p-6 flex-1 shadow-sm border border-border hover:shadow-md transition-shadow duration-300 min-h-[400px]">
            {selectedProduct && selectedApiVariant ? ( 
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
                  
                  <div className="md:w-1/2">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-50 group">
                      <Image
                        src={checkImageUrl(selectedApiVariant?.images?.[0] || selectedProduct.variants[0]?.images?.[0])}
                        alt={selectedProduct.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    
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
                  
                  
                  <div className="md:w-1/2">
                    <h2 className="text-2xl font-bold !text-[#374151]/80">{selectedProduct.name}</h2>
                    <p className="text-gray-500 mb-4">{getBrandName(selectedProduct.brand)}</p>
                    
                    {selectedProduct.description && (
                      <p className="text-gray-600 mb-4 text-sm">{selectedProduct.description}</p>
                    )}
                    
                    
                    {availableSizesForSelectedColor.length > 0 && selectedApiVariant?.colorId && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-3 !text-[#374151]/80">Kích thước:</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableSizesForSelectedColor.map((size) => {
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
                    
                    
                    {selectedApiVariant && ( 
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
                        className="bg-white rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
                      >
                        <div 
                          className="relative h-48 w-full bg-gray-50 overflow-hidden cursor-pointer"
                          onClick={() => handleProductSelect(product)}
                        >
                          <Image
                            src={checkImageUrl(firstVariant?.images?.[0]  )}
                            alt={product.name}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
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
                          <h3 
                            className="font-medium !text-[#374151]/80 group-hover:text-primary transition-colors truncate cursor-pointer"
                            onClick={() => handleProductSelect(product)}
                          >
                            {product.name}
                          </h3>
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
                          <Button 
                            variant="outline" 
                            className="w-full mt-3 flex items-center justify-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              const firstAvailableVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
                              if (firstAvailableVariant) {
                                const cartItemId = `${product._id}-${firstAvailableVariant._id}`;
                                const existingItemIndex = cartItems.findIndex(item => item.id === cartItemId);
                                
                                if (existingItemIndex >= 0) {
                                  if (cartItems[existingItemIndex].quantity < firstAvailableVariant.stock) {
                                    const updatedItems = [...cartItems];
                                    updatedItems[existingItemIndex].quantity += 1;
                                    setCartItems(updatedItems);
                                    toast.success('Đã cập nhật số lượng sản phẩm.');
                                  } else {
                                    toast.warn('Số lượng sản phẩm trong kho không đủ.');
                                  }
                                } else {
                                  if (firstAvailableVariant.stock > 0) {
                                    const newItem: UpdatedCartItem = {
                                      id: cartItemId,
                                      productId: product._id,
                                      variantId: firstAvailableVariant._id,
                                      name: product.name,
                                      colorName: firstAvailableVariant.colorId?.name || 'N/A',
                                      colorCode: firstAvailableVariant.colorId?.code,
                                      sizeName: firstAvailableVariant.sizeId?.name || firstAvailableVariant.sizeId?.value || 'N/A',
                                      price: firstAvailableVariant.price,
                                      quantity: 1,
                                      image: firstAvailableVariant.images?.[0] || product.variants[0]?.images?.[0] || '/placeholder.svg',
                                      stock: firstAvailableVariant.stock,
                                      actualColorId: firstAvailableVariant.colorId?._id,
                                      actualSizeId: firstAvailableVariant.sizeId?._id,
                                    };
                                    setCartItems([...cartItems, newItem]);
                                    toast.success('Đã thêm sản phẩm vào giỏ hàng');
                                  } else {
                                    toast.warn('Sản phẩm này đã hết hàng.');
                                  }
                                }
                              } else {
                                toast.warn('Sản phẩm này không có biến thể hoặc đã hết hàng.');
                              }
                            }}
                            disabled={product.variants.every(v => v.stock === 0)}
                          >
                            <Icon path={mdiPlus} size={0.8} />
                            Thêm vào giỏ
                          </Button>
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
                          const firstAvailableVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
                          return (
                          <tr 
                            key={product._id} 
                            className="border-t border-border hover:bg-muted/20 transition-colors cursor-pointer"
                          >
                            <td className="py-3 px-4" onClick={() => handleProductSelect(product)}>
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-50">
                                  <Image
                                    src={checkImageUrl(firstVariant?.images?.[0]  )}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <span className="font-medium !text-[#374151]/80 truncate max-w-[150px]">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 truncate max-w-[100px]" onClick={() => handleProductSelect(product)}>{getBrandName(product.brand)}</td>
                            <td className="py-3 px-4 text-primary font-medium" onClick={() => handleProductSelect(product)}>{firstVariant ? formatCurrency(firstVariant.price) : 'N/A'}</td>
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
                                  <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-gray-500">
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
                                        <Icon path={mdiInformationOutline} size={0.8} className="text-gray-400" />
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
                                            const cartItemId = `${product._id}-${firstAvailableVariant._id}`;
                                            const existingItemIndex = cartItems.findIndex(item => item.id === cartItemId);
                                            
                                            if (existingItemIndex >= 0) {
                                              if (cartItems[existingItemIndex].quantity < firstAvailableVariant.stock) {
                                                const updatedItems = [...cartItems];
                                                updatedItems[existingItemIndex].quantity += 1;
                                                setCartItems(updatedItems);
                                                toast.success('Đã cập nhật số lượng sản phẩm.');
                                              } else {
                                                toast.warn('Số lượng sản phẩm trong kho không đủ.');
                                              }
                                            } else {
                                              if (firstAvailableVariant.stock > 0) {
                                                const newItem: UpdatedCartItem = {
                                                  id: cartItemId,
                                                  productId: product._id,
                                                  variantId: firstAvailableVariant._id,
                                                  name: product.name,
                                                  colorName: firstAvailableVariant.colorId?.name || 'N/A',
                                                  colorCode: firstAvailableVariant.colorId?.code,
                                                  sizeName: firstAvailableVariant.sizeId?.name || firstAvailableVariant.sizeId?.value || 'N/A',
                                                  price: firstAvailableVariant.price,
                                                  quantity: 1,
                                                  image: firstAvailableVariant.images?.[0] || product.variants[0]?.images?.[0] || '/placeholder.svg',
                                                  stock: firstAvailableVariant.stock,
                                                  actualColorId: firstAvailableVariant.colorId?._id,
                                                  actualSizeId: firstAvailableVariant.sizeId?._id,
                                                };
                                                setCartItems([...cartItems, newItem]);
                                                toast.success('Đã thêm sản phẩm vào giỏ hàng');
                                              } else {
                                                toast.warn('Sản phẩm này đã hết hàng.');
                                              }
                                            }
                                          }
                                        }}
                                      >
                                        <Icon path={mdiPlus} size={0.8} className="text-gray-400" />
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
                
                {rawData?.data?.pagination && rawData.data.pagination.totalPages > 1 && (
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
                          const totalPages = rawData.data.pagination.totalPages;
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
                                endPage = Math.min(totalPages -1, 3);
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
                              if (pagination.page < rawData.data.pagination.totalPages) {
                                setPagination(p => ({ ...p, page: p.page + 1 }));
                              }
                            }}
                            disabled={pagination.page >= rawData.data.pagination.totalPages}
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
                          src={item.image  }
                          alt={item.name}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
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
                  className="px-4 py-2.5 font-semibold text-white"
                  onClick={applyCoupon}
                  disabled={isFetchingVoucher}
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
            </div>
            
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              {appliedVoucher && appliedDiscount > 0 && ( 
                <div className="flex justify-between text-primary">
                  <span>Giảm giá ({appliedVoucher.code}):</span>
                  <span>-{formatCurrency(calculateDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg pt-3 border-t border-border">
                <span className="!text-[#374151]/80">Tổng:</span>
                <span className="text-primary">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            
            
            <Button
              className="w-full py-6 text-base flex items-center justify-center gap-2"
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
            >
              <Icon path={mdiCashRegister} size={1} />
              Thanh toán
              <span className="text-xs opacity-70 ml-1">(Alt+P)</span>
            </Button>
            
            
            <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
              <Icon path={mdiInformationOutline} size={0.6} className="mr-1 text-gray-400" />
              <span>Alt+S: Tìm kiếm | Alt+C: Xóa giỏ hàng</span>
            </div>
          </div>
        </div>
      </div>
      
      
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="!text-[#374151]/80">Xác nhận thanh toán</DialogTitle>
            <DialogDescription>
              Tổng tiền: {formatCurrency(totalAmount)}. Hoàn tất thông tin thanh toán để hoàn thành đơn hàng.
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
                onValueChange={(value) => {
                  setPaymentMethod(value);
                  if (value !== 'cash') {
                    setCashReceived(totalAmount.toString());
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

            {paymentMethod === 'cash' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="cash-received" className="text-right text-sm !text-[#374151]/80">
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Số lượng sản phẩm:</span>
                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              {appliedVoucher && appliedDiscount > 0 && ( 
                <div className="flex justify-between text-sm text-primary">
                  <span>Giảm giá ({appliedVoucher.code}):</span>
                  <span>-{formatCurrency(calculateDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-base pt-2 border-t border-border">
                <span className="!text-[#374151]/80">Tổng thanh toán:</span>
                <span className="text-primary">{formatCurrency(totalAmount)}</span>
              </div>
              {paymentMethod === 'cash' && !isNaN(cashReceivedNum) && cashReceivedNum >= totalAmount && changeDue >= 0 && (
                <div className="flex justify-between font-medium text-base pt-2">
                    <span className="!text-[#374151]/80">Tiền thừa trả khách:</span>
                    <span className="text-green-600">{formatCurrency(changeDue)}</span>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckoutDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleCheckout} 
              disabled={checkoutIsLoading || (paymentMethod === 'cash' && (cashReceived.toString() === '' || parseFloat(cashReceived.toString()) < totalAmount || isNaN(parseFloat(cashReceived.toString())) )) }
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
                  <Icon path={mdiCashRegister} size={0.8} className="mr-2" />
                  Hoàn tất thanh toán
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VouchersListDialog 
        open={showVouchersDialog} 
        onOpenChange={setShowVouchersDialog}
        onSelectVoucher={(code) => {
          setCouponCode(code); 
        }}
      />

      <InvoiceDialog
        open={showInvoiceDialog}
        onOpenChange={setShowInvoiceDialog}
        invoiceData={currentInvoiceData}
        formatCurrency={formatCurrency}
        formatDateTimeForInvoice={formatDateTimeForInvoice}
      />
    </div>
  );
}


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


const VouchersListDialog = ({ open, onOpenChange, onSelectVoucher }: { open: boolean, onOpenChange: (open: boolean) => void, onSelectVoucher: (code: string) => void }) => {
  const { data: vouchersData, isLoading, isError } = useVouchers({ page: 1, limit: 100, status: 'HOAT_DONG' }); 

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`Đã sao chép mã: ${code}`);
      onSelectVoucher(code); 
      onOpenChange(false); 
    }).catch(err => {
      toast.error('Không thể sao chép mã.');
      console.error('Failed to copy: ', err);
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="!text-[#374151]/80">Danh sách mã giảm giá</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 py-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-4">Lỗi khi tải danh sách mã giảm giá.</p>
          ) : !vouchersData?.data?.vouchers || vouchersData.data.vouchers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Không có mã giảm giá nào đang hoạt động.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Đơn tối thiểu</TableHead>
                  <TableHead>Còn lại</TableHead>
                  <TableHead>Hết hạn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchersData.data.vouchers.map((voucher) => (
                  <TableRow key={voucher._id}>
                    <TableCell className="font-mono">{voucher.code}</TableCell>
                    <TableCell>{voucher.name}</TableCell>
                    <TableCell>
                      {voucher.type === 'PERCENTAGE' ? `${voucher.value}%` : formatCurrency(voucher.value)}
                      {voucher.type === 'PERCENTAGE' && (voucher as any).maxValue && (
                        <span className="text-xs text-gray-500 block"> (Tối đa {formatCurrency((voucher as any).maxValue)})</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(voucher.minOrderValue)}</TableCell>
                    <TableCell>{voucher.quantity - voucher.usedCount > 0 ? voucher.quantity - voucher.usedCount : <Badge variant="destructive">Hết</Badge>}</TableCell>
                    <TableCell>{formatDate(voucher.endDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(voucher.code)}
                        title="Sao chép và chọn mã"
                        disabled={voucher.quantity - voucher.usedCount <= 0 || new Date(voucher.endDate) < new Date()}
                      >
                        <Icon path={mdiContentCopy} size={0.8} className="mr-1" /> Chọn
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
      // Show processing indicator
      setIsProcessing(true);
      
      // Display processing message
      const processingMsg = document.createElement("div");
      processingMsg.style.position = "fixed";
      processingMsg.style.top = "50%";
      processingMsg.style.left = "50%";
      processingMsg.style.transform = "translate(-50%, -50%)";
      processingMsg.style.padding = "20px";
      processingMsg.style.background = "rgba(0,0,0,0.7)";
      processingMsg.style.color = "white";
      processingMsg.style.borderRadius = "5px";
      processingMsg.style.zIndex = "9999";
      processingMsg.textContent = "Đang tạo PDF...";
      document.body.appendChild(processingMsg);

      // Wait for state update to process
      await new Promise(resolve => setTimeout(resolve, 100));

      const input = invoiceRef.current;
      if (!input) throw new Error("Invoice element not found");

      const canvas = await toPng(input, {
        quality: 0.95,
        pixelRatio: 2,
        skipAutoScale: true,
        cacheBust: true,
      });

      // Create PDF from image
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

      // Handle multi-page content if necessary
      if (imgHeight > pdf.internal.pageSize.getHeight()) {
        let heightLeft = imgHeight;
        let position = 0;
        let page = 1;

        while (heightLeft >= 0) {
          position = -pdf.internal.pageSize.getHeight() * page;
          pdf.addPage();
          pdf.addImage(canvas, 'PNG', 0, position, pageWidth, imgHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
          page++;
        }
      }

      // Save PDF
      pdf.save(`HoaDon_${invoiceData.orderId.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      toast.success("Đã lưu hoá đơn PDF thành công!");

    } catch (error) {
      console.error("Error printing PDF:", error);
      toast.error("Lỗi khi in hoá đơn PDF.");
    } finally {
      // Remove processing message and reset state
      const processingMsg = document.querySelector('div[style*="position: fixed"][style*="z-index: 9999"]');
      if (processingMsg && processingMsg.parentNode) {
        processingMsg.parentNode.removeChild(processingMsg);
      }
      setIsProcessing(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col min-h-0">
        <DialogHeader>
          <DialogTitle className="!text-[#374151]/80 text-center text-2xl font-semibold">Hoá đơn bán hàng</DialogTitle>
        </DialogHeader>
        <CustomScrollArea className="flex-1 min-h-0 p-6 overflow-y-auto">
          <div ref={invoiceRef} className="p-4 bg-white" id="invoice-content" data-loaded={!!invoiceData}>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">{invoiceData.shopInfo.name}</h2>
              <p className="text-sm">{invoiceData.shopInfo.address}</p>
              <p className="text-sm">ĐT: {invoiceData.shopInfo.phone} - Email: {invoiceData.shopInfo.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
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

            <Table className="mb-6 text-sm">
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

            <div className="flex justify-end mb-6">
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
                  <Separator/>
                  <div className="flex justify-between font-bold text-base">
                      <span>TỔNG THANH TOÁN:</span>
                      <span className="text-primary">{formatCurrency(invoiceData.total)}</span>
                  </div>
                  <Separator/>
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
            <Icon path={mdiPrinter} size={0.8} className="mr-2" />
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              'Lưu PDF & In'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
