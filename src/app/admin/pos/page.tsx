'use client';

import { useState } from 'react';
import { categories, products, CartItem, Product, ProductColor, ProductSize } from '@/components/POSPage/mockData';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiMinus, mdiDelete, mdiCashRegister, mdiTag, mdiQrcodeScan } from '@mdi/js';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState<string>('cat-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  const filteredProducts = products.filter((product) => {
    // Lọc theo danh mục
    if (activeCategory !== 'cat-1') {
      // Lọc theo danh mục ở đây (giả lập)
    }
    
    // Lọc theo từ khóa tìm kiếm
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

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);

    if (existingItemIndex >= 0) {
      // Tăng số lượng nếu sản phẩm đã có trong giỏ hàng
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // Thêm sản phẩm mới vào giỏ hàng
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
    
    toast.success('Đã thanh toán thành công');
    setCartItems([]);
    setAppliedDiscount(0);
    setCouponCode('');
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">Bán hàng tại quầy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-13rem)]">
        {/* Phần sản phẩm */}
        <div className="lg:col-span-2 overflow-hidden flex flex-col">
          {/* Thanh tìm kiếm và danh mục */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Icon path={mdiMagnify} size={1} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => console.log('Quét mã QR')}
              >
                <div className="flex items-center">
                  <Icon path={mdiQrcodeScan} size={0.8} className="mr-2" />
                  <span>Quét mã QR</span>
                </div>
              </button>
            </div>
            
            {/* Danh mục */}
            <div className="flex overflow-x-auto pb-2 scrollbar-thin gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    'whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Danh sách sản phẩm */}
          <div className="bg-white rounded-lg p-4 overflow-y-auto flex-1 shadow-sm scrollbar-thin border">
            {selectedProduct ? (
              <div className="mb-4">
                <button
                  className="mb-4 text-sm text-primary font-medium flex items-center"
                  onClick={() => setSelectedProduct(null)}
                >
                  ← Quay lại danh sách sản phẩm
                </button>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Hình ảnh sản phẩm */}
                  <div className="md:w-1/2">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={selectedColor?.image || ''}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Màu sắc */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Màu sắc:</h3>
                      <div className="flex gap-2">
                        {selectedProduct.colors.map((color) => (
                          <button
                            key={color.id}
                            className={cn(
                              'h-8 w-8 rounded-full border-2',
                              selectedColor?.id === color.id
                                ? 'border-primary'
                                : 'border-gray-300'
                            )}
                            style={{ backgroundColor: color.code }}
                            onClick={() => handleColorSelect(color)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Thông tin sản phẩm */}
                  <div className="md:w-1/2">
                    <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                    <p className="text-gray-500 mb-4">{selectedProduct.brand}</p>
                    
                    {selectedProduct.description && (
                      <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
                    )}
                    
                    {/* Kích thước */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Kích thước:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedColor?.sizes.map((size) => (
                          <button
                            key={size.id}
                            className={cn(
                              'px-3 py-1 rounded border text-sm font-medium',
                              selectedSize?.id === size.id
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            )}
                            onClick={() => handleSizeSelect(size)}
                            disabled={size.quantity === 0}
                          >
                            {size.size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Giá và số lượng */}
                    {selectedSize && (
                      <>
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-1">Giá:</h3>
                          <p className="text-xl font-bold text-primary">
                            {formatCurrency(selectedSize.price)}
                          </p>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-sm font-medium mb-1">Số lượng trong kho:</h3>
                          <p className="text-gray-700">{selectedSize.quantity} sản phẩm</p>
                        </div>
                        
                        <button
                          className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
                          onClick={addToCart}
                          disabled={selectedSize.quantity === 0}
                        >
                          Thêm vào giỏ hàng
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image
                        src={product.colors[0].image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
                      <p className="text-primary font-medium">
                        {formatCurrency(product.colors[0].sizes[0].price)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Giỏ hàng */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Giỏ hàng</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-gray-500">Giỏ hàng trống</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => removeCartItem(item.id)}
                        >
                          <Icon path={mdiDelete} size={0.8} />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>Size: {item.size}</span> •{' '}
                        <span>Màu: {item.color}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            className="px-2 py-1 text-gray-500 hover:text-primary"
                            onClick={() => updateCartItemQuantity(item.id, -1)}
                          >
                            <Icon path={mdiMinus} size={0.7} />
                          </button>
                          <span className="px-2 min-w-[30px] text-center">{item.quantity}</span>
                          <button
                            className="px-2 py-1 text-gray-500 hover:text-primary"
                            onClick={() => updateCartItemQuantity(item.id, 1)}
                          >
                            <Icon path={mdiPlus} size={0.7} />
                          </button>
                        </div>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            {/* Mã giảm giá */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Icon path={mdiTag} size={0.8} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <button
                  className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
                  onClick={applyCoupon}
                >
                  Áp dụng
                </button>
              </div>
            </div>
            
            {/* Tóm tắt đơn hàng */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Giảm giá ({appliedDiscount}%):</span>
                  <span>-{formatCurrency(calculateDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Tổng:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            
            {/* Nút thanh toán */}
            <button
              className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              <Icon path={mdiCashRegister} size={1} className="mr-2" />
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 