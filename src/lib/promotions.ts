import { IPromotion } from "@/interface/response/promotion";

export interface ProductWithDiscount {
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  appliedPromotion?: IPromotion;
}

/**
 * Calculate the highest discount for a product based on active promotions
 */
export const calculateProductDiscount = (
  productId: string,
  originalPrice: number,
  activePromotions: IPromotion[]
): ProductWithDiscount => {
  if (!activePromotions || activePromotions.length === 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountPercent: 0,
    };
  }

  const now = new Date();
  
  // Filter applicable promotions for this product
  const applicablePromotions = activePromotions.filter(promotion => {
    // Check if promotion is active
    if (promotion.status !== 'HOAT_DONG') return false;
    
    // Check if promotion is within date range
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    if (now < startDate || now > endDate) return false;
    
    // Check if promotion applies to this product
    // If products array is empty, it applies to all products
    if (!promotion.products || promotion.products.length === 0) return true;
    
    // Check if product is in the promotion's product list
    return promotion.products.some((p: any) => {
      const id = typeof p === 'string' ? p : p._id;
      return id === productId;
    });
  });

  if (applicablePromotions.length === 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountPercent: 0,
    };
  }

  // Find the promotion with the highest discount
  const bestPromotion = applicablePromotions.reduce((best, current) => {
    return current.discountPercent > best.discountPercent ? current : best;
  });

  const discountAmount = (originalPrice * bestPromotion.discountPercent) / 100;
  const discountedPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountedPrice: Math.max(0, discountedPrice), // Ensure price doesn't go below 0
    discountPercent: bestPromotion.discountPercent,
    appliedPromotion: bestPromotion,
  };
};

/**
 * Apply promotions to a list of products
 */
export const applyPromotionsToProducts = (
  products: any[],
  activePromotions: IPromotion[]
): any[] => {
  return products.map(product => {
    // Get the base price from the first variant
    const basePrice = product.variants?.[0]?.price || 0;
    
    const discountInfo = calculateProductDiscount(
      product._id,
      basePrice,
      activePromotions
    );

    return {
      ...product,
      originalPrice: discountInfo.originalPrice,
      discountedPrice: discountInfo.discountedPrice,
      discountPercent: discountInfo.discountPercent,
      appliedPromotion: discountInfo.appliedPromotion,
      hasDiscount: discountInfo.discountPercent > 0,
    };
  });
};

/**
 * Format price with currency
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Check if a promotion is currently active
 */
export const isPromotionActive = (promotion: IPromotion): boolean => {
  if (promotion.status !== 'HOAT_DONG') return false;
  
  const now = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);
  
  return now >= startDate && now <= endDate;
}; 