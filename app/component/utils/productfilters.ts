import { Product } from '../type/product';
import { FilterState } from '../type/filter';

export const filterProducts = (products: Product[], filters: FilterState): Product[] => {
  let filtered = [...products];

  // Filter by categories
  if (filters.categories.length > 0) {
    filtered = filtered.filter(product => 
      filters.categories.includes(product.idloaisanpham)
    );
  }

  // Filter by gender
  if (filters.gender.length > 0) {
    filtered = filtered.filter(product => {
      const isNam = filters.gender.includes('nam');
      const isNu = filters.gender.includes('nu');
      return (isNam && product.gioitinh) || (isNu && !product.gioitinh);
    });
  }

  // Filter by price range
  filtered = filtered.filter(product => {
    const finalPrice = product.giamgia > 0 
      ? product.gia * (1 - product.giamgia / 100) 
      : product.gia;
    return finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
  });

  // Filter by sizes
  if (filters.sizes.length > 0) {
    filtered = filtered.filter(product => 
      product.ProductSizes?.some(ps => 
        filters.sizes.includes(ps.size.tenSize)
      )
    );
  }

  return filtered;
};