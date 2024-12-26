export const calculateDiscountedPrice = (
    originalPrice: number = 0,
    discountPercent: number = 0
  ): number => {
    if (discountPercent <= 0) return originalPrice;
    return originalPrice * (1 - discountPercent / 100);
  };