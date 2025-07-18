import api from './api';
import { Product, ProductFilter, PriceRange } from '@/types';

export const productService = {
  getProducts: async (filter?: ProductFilter): Promise<Product[]> => {
    const params = new URLSearchParams();
    
    if (filter?.brandId !== undefined && filter.brandId !== null) {
      params.append('brandId', filter.brandId.toString());
    }
    if (filter?.minPrice !== undefined && filter.minPrice !== null) {
      params.append('minPrice', filter.minPrice.toString());
    }
    if (filter?.maxPrice !== undefined && filter.maxPrice !== null) {
      params.append('maxPrice', filter.maxPrice.toString());
    }
    
    const response = await api.get<Product[]>(`/products?${params}`);
    return response.data;
  },

  getPriceRange: async (brandId?: number): Promise<PriceRange> => {
    const params = brandId ? `?brandId=${brandId}` : '';
    const response = await api.get<PriceRange>(`/products/price-range${params}`);
    return response.data;
  },
};
