'use client';

import { useState, useEffect } from 'react';
import { categories, products, CartItem, Product, ProductColor, ProductSize } from '@/components/POSPage/mockData';
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
  mdiAccountOutline,
  mdiReceiptOutline,
  mdiClockOutline,
  mdiChevronDown,
  mdiInformationOutline
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
  DialogTrigger,
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

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState<string>('cat-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //                                                                                                                     Stats for the dashboard
  const [stats, setStats] = useState({
    dailySales: 12500000,
    totalOrders: 24,
    averageOrder: 520000,
    pendingOrders: 3
  });

  //                                                                                                                     Recent transactions
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 'TX-1234', customer: 'Nguyễn Văn A', amount: 1250000, time: '10:25', status: 'completed' },
    { id: 'TX-1233', customer: 'Trần Thị B', amount: 850000, time: '09:40', status: 'completed' },
    { id: 'TX-1232', customer: 'Lê Văn C', amount: 2100000, time: '09:15', status: 'pending' }
  ]);

  const filteredProducts = products.filter((product) => {
    //                                                                                                                     Filter by category
    if (activeCategory !== 'cat-1') {
      //                                                                                                                     Category filtering logic here (simulated)
    }
    
    //                                                                                                                     Filter by search query
    if (searchQuery) {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]);
    setSelectedSize(null);
  };

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const handleSizeSelect = (size: ProductSize) => {
    setSelectedSize(size);
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedColor || !selectedSize) {
      toast.error('Vui lòng chọn sản phẩm, màu và kích thước');
      return;
    }

    const newItem: CartItem = {
      id: `${selectedProduct.id}-${selectedColor.id}-${selectedSize.id}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      color: selectedColor.name,
      colorCode: selectedColor.code,
      size: selectedSize.size,
      price: selectedSize.price,
      quantity: 1,
      image: selectedColor.image,
    };

    //                                                                                                                     Check if the product is already in the cart
    const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);

    if (existingItemIndex >= 0) {
      //                                                                                                                     Increase quantity if the product is already in the cart
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      //                                                                                                                     Add new product to cart
      setCartItems([...cartItems, newItem]);
    }

    toast.success('Đã thêm sản phẩm vào giỏ hàng');
    setSelectedProduct(null);
    setSelectedColor(null);
    setSelectedSize(null);
  };

  const updateCartItemQuantity = (id: string, amount: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + amount;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
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
    
    setIsLoading(true);
    
    //                                                                                                                     Simulate processing payment
    setTimeout(() => {
      setIsLoading(false);
      setShowCheckoutDialog(false);
      
      //                                                                                                                     Update stats
      setStats(prev => ({
        ...prev,
        dailySales: prev.dailySales + calculateTotal(),
        totalOrders: prev.totalOrders + 1,
        averageOrder: Math.round((prev.dailySales + calculateTotal()) / (prev.totalOrders + 1))
      }));
      
      //                                                                                                                     Add to recent transactions
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

  //                                                                                                                     Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      //                                                                                                                     Alt + P to proceed to checkout
      if (e.altKey && e.key === 'p') {
        handleProceedToCheckout();
      }
      
      //                                                                                                                     Alt + C to clear cart
      if (e.altKey && e.key === 'c') {
        if (cartItems.length > 0) {
          setCartItems([]);
          toast.success('Đã xóa giỏ hàng');
        }
      }
      
      //                                                                                                                     Alt + S to focus search
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
  }, [cartItems]);

  return (
    <div className="h-full">
      {/* Header with breadcrumb and stats */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin" className="text-gray-600 hover:text-primary transition-colors">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-primary">Bán hàng tại quầy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Icon path={mdiClockOutline} size={0.9} className="text-gray-400" />
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
                    <Icon path={mdiReceiptOutline} size={0.9} className="text-gray-400" />
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
                    <Icon path={mdiAccountOutline} size={0.9} className="text-gray-400" />
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
                <input
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
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    'whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    activeCategory === category.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-primary'
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Products list */}
          <div className="bg-white rounded-lg p-6 flex-1 shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
            {selectedProduct ? (
              <div className="mb-4">
                <button
                  className="mb-4 text-sm text-primary font-medium flex items-center hover:text-primary/80 transition-colors"
                  onClick={() => setSelectedProduct(null)}
                >
                  ← Quay lại danh sách sản phẩm
                </button>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Product image */}
                  <div className="md:w-1/2">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-50 group">
                      <Image
                        src={selectedColor?.image || ''}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Colors */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-3 !text-[#374151]/80">Màu sắc:</h3>
                      <div className="flex gap-3">
                        {selectedProduct.colors.map((color) => (
                          <button
                            key={color.id}
                            className={cn(
                              'h-10 w-10 rounded-full border-2 transition-all duration-200 hover:scale-110',
                              selectedColor?.id === color.id
                                ? 'border-primary shadow-md'
                                : 'border-gray-200 hover:border-primary/50'
                            )}
                            style={{ backgroundColor: color.code }}
                            onClick={() => handleColorSelect(color)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Product info */}
                  <div className="md:w-1/2">
                    <h2 className="text-2xl font-bold !text-[#374151]/80">{selectedProduct.name}</h2>
                    <p className="text-gray-500 mb-4">{selectedProduct.brand}</p>
                    
                    {selectedProduct.description && (
                      <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                    )}
                    
                    {/* Sizes */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-3 !text-[#374151]/80">Kích thước:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedColor?.sizes.map((size) => (
                          <button
                            key={size.id}
                            className={cn(
                              'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                              selectedSize?.id === size.id
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary/50 hover:text-primary',
                              size.quantity === 0 && 'opacity-50 cursor-not-allowed'
                            )}
                            onClick={() => handleSizeSelect(size)}
                            disabled={size.quantity === 0}
                          >
                            {size.size}
                            {size.quantity === 0 && ' (Hết hàng)'}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price and quantity */}
                    {selectedSize && (
                      <>
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-1 !text-[#374151]/80">Giá:</h3>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(selectedSize.price)}
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-1 !text-[#374151]/80">Số lượng trong kho:</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600">{selectedSize.quantity} sản phẩm</p>
                            <Badge variant={selectedSize.quantity > 10 ? "secondary" : selectedSize.quantity > 0 ? "outline" : "destructive" }>
                              {selectedSize.quantity > 10 ? "Còn hàng" : selectedSize.quantity > 0 ? "Sắp hết" : "Hết hàng"}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          className="w-full py-6 text-base"
                          onClick={addToCart}
                          disabled={selectedSize.quantity === 0}
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
                    Hiển thị {filteredProducts.length} sản phẩm
                  </div>
                </div>
                
                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
                          <Image
                            src={product.colors[0].image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
                              {product.colors.length} màu
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium !text-[#374151]/80 group-hover:text-primary transition-colors">{product.name}</h3>
                          <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-primary font-medium">
                              {formatCurrency(product.colors[0].sizes[0].price)}
                            </p>
                            <div className="flex -space-x-1">
                              {product.colors.slice(0, 3).map((color) => (
                                <div 
                                  key={color.id}
                                  className="h-5 w-5 rounded-full border border-white"
                                  style={{ backgroundColor: color.code }}
                                />
                              ))}
                              {product.colors.length > 3 && (
                                <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-gray-500">
                                  +{product.colors.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
                        {filteredProducts.map((product) => (
                          <tr 
                            key={product.id} 
                            className="border-t border-border hover:bg-muted/20 transition-colors cursor-pointer"
                            onClick={() => handleProductSelect(product)}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-50">
                                  <Image
                                    src={product.colors[0].image || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-medium !text-[#374151]/80">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{product.brand}</td>
                            <td className="py-3 px-4 text-primary font-medium">{formatCurrency(product.colors[0].sizes[0].price)}</td>
                            <td className="py-3 px-4">
                              <div className="flex -space-x-1">
                                {product.colors.slice(0, 3).map((color) => (
                                  <div 
                                    key={color.id}
                                    className="h-5 w-5 rounded-full border border-white"
                                    style={{ backgroundColor: color.code }}
                                  />
                                ))}
                                {product.colors.length > 3 && (
                                  <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-gray-500">
                                    +{product.colors.length - 3}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={product.colors[0].sizes[0].quantity > 10 ? "secondary" : product.colors[0].sizes[0].quantity > 0 ? "outline" : "destructive"} className="text-xs">
                                {product.colors[0].sizes[0].quantity > 10 ? "Còn hàng" : product.colors[0].sizes[0].quantity > 0 ? "Sắp hết" : "Hết hàng"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => {
                                e.stopPropagation();
                                handleProductSelect(product);
                              }}>
                                <Icon path={mdiPlus} size={0.8} className="text-gray-400" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
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
                          <h3 className="font-medium !text-[#374151]/80">{item.name}</h3>
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => removeCartItem(item.id)}
                          >
                            <Icon path={mdiDelete} size={0.8} />
                          </button>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span>Size: {item.size}</span> •{' '}
                          <span>Màu: {item.color}</span>
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
                  <input
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
              Hoàn tất thông tin thanh toán để hoàn thành đơn hàng.
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
            <Button onClick={handleCheckout} disabled={isLoading}>
              {isLoading ? (
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
