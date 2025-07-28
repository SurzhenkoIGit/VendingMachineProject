'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBrandFilter, setPriceFilter, fetchProducts, fetchPriceRange } from '@/store/productSlice';

export const Filters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { brands, priceRange, filter } = useAppSelector((state) => state.products);
  const [localPriceRange, setLocalPriceRange] = useState({
    min: priceRange.minPrice,
    max: priceRange.maxPrice,
  });

  useEffect(() => {
    setLocalPriceRange({
      min: priceRange.minPrice,
      max: priceRange.maxPrice,
    });
  }, [priceRange]);

  const handleBrandChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const brandId = value === '' ? undefined : Number(value);
    
    await dispatch(setBrandFilter(brandId));
    
    const priceRangeResult = await dispatch(fetchPriceRange(brandId));
    
    const newPriceRange = priceRangeResult.payload as { minPrice: number; maxPrice: number };
    
    const currentFilter = {
      brandId,
      minPrice: newPriceRange.minPrice,
      maxPrice: newPriceRange.maxPrice
    };
    
    await dispatch(setPriceFilter({
      minPrice: newPriceRange.minPrice,
      maxPrice: newPriceRange.maxPrice
    }));
    
    await dispatch(fetchProducts(currentFilter));
  };

  const handlePriceChange = async (type: 'min' | 'max', value: number) => {
    const newPriceRange = {
      ...localPriceRange,
      [type]: value
    };
    
    setLocalPriceRange(newPriceRange);

    const priceFilter = {
      minPrice: newPriceRange.min,
      maxPrice: newPriceRange.max,
    };
    
    await dispatch(setPriceFilter(priceFilter));
    
    const currentFilter = {
      brandId: filter.brandId,
      ...priceFilter
    };
    
    await dispatch(fetchProducts(currentFilter));
  };


  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Фильтры</h2>
      
      <div className="flex items-center justify-between p-6 w-full gap-8">
        <div className="w-1/4">
          <label htmlFor="brand" className="block text-sm mb-2">
            Выберите бренд
          </label>
          <select
            id="brand"
            value={filter.brandId || ''}
            onChange={handleBrandChange}
            className="w-full p-2 border rounded">
            <option value="">Все бренды</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-grow">
          <label className="block text-sm mb-5">
            Стоимость
          </label>
          <div className="flex items-center gap-2">
            <span>{localPriceRange.min} ₽</span>

            <input
                type="range"
                min={priceRange.minPrice}
                max={priceRange.maxPrice}
                value={localPriceRange.min}
                onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                className="flex flex-row w-1/2"
            />
            <span>{localPriceRange.max} ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};
