import { IPromotion } from "@/interface/response/promotion";

export interface ProductWithDiscount {
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  appliedPromotion?: IPromotion;
}

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

  const applicablePromotions = activePromotions.filter(promotion => {
    if (promotion.status !== 'HOAT_DONG') {
      return false;
    }

    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    
    // Create new dates with 7 hours subtracted
    const newStartDate = new Date(startDate.getTime() - 7 * 60 * 60 * 1000);
    const newEndDate = new Date(endDate.getTime() - 7 * 60 * 60 * 1000);
    if (now < newStartDate || now > newEndDate) {
      return false;
    }

    if (!promotion.products || promotion.products.length === 0) {
      return true;
    }

    const isApplicable = promotion.products.some((p: any) => {
      let promotionProductId: string;

      if (typeof p === 'string') {
        promotionProductId = p;
      } else if (p && typeof p === 'object') {
        promotionProductId = p._id || p.id;
      } else {
        return false;
      }

      return promotionProductId === productId;
    });

    return isApplicable;
  });

  if (applicablePromotions.length === 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountPercent: 0,
    };
  }

  const bestPromotion = applicablePromotions.reduce((best, current) => {
    return current.discountPercent > best.discountPercent ? current : best;
  });

  const discountAmount = (originalPrice * bestPromotion.discountPercent) / 100;
  const discountedPrice = originalPrice - discountAmount;
  
  const result = {
    originalPrice,
    discountedPrice: Math.max(0, Math.round(discountedPrice)),
    discountPercent: bestPromotion.discountPercent,
    appliedPromotion: bestPromotion,
  };
  
  return result;
};

export const applyPromotionsToProducts = (
  products: any[],
  activePromotions: IPromotion[]
): any[] => {
  if (!activePromotions || activePromotions.length === 0) {
    return products;
  }

  return products.map(product => {
    const basePrice = product.variants?.[0]?.price || 0;

    if (basePrice === 0) {
      return {
        ...product,
        originalPrice: 0,
        discountedPrice: 0,
        discountPercent: 0,
        hasDiscount: false,
      };
    }

    const discountInfo = calculateProductDiscount(
      product._id,
      basePrice,
      activePromotions
    );

    const result = {
      ...product,
      originalPrice: discountInfo.originalPrice,
      discountedPrice: discountInfo.discountedPrice,
      discountPercent: discountInfo.discountPercent,
      appliedPromotion: discountInfo.appliedPromotion,
      hasDiscount: discountInfo.discountPercent > 0,
    };

    return result;
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
  
  // Create dates in Vietnam timezone by using toLocaleString
  const startDateVietnam = new Date(startDate.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
  const endDateVietnam = new Date(endDate.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));

  return now >= startDateVietnam && now <= endDateVietnam;
}; 