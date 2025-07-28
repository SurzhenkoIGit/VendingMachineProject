'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {products.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">Нет товаров, соответствующих выбранным фильтрам</p>
        </div>
      )}
    </div>
  );
};
