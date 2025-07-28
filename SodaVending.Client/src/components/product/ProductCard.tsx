'use client';

import React from 'react';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const currentQuantityInCart = cartItem?.quantity || 0;
  const canAddMore = currentQuantityInCart < product.quantity;
  const isOutOfStock = product.quantity === 0;

  const handleAddToCart = () => {
    if (canAddMore) {
      dispatch(addToCart(product));
    }
  };

  return (
    <div className="product-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="h-[200px] flex items-center justify-center mb-4">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-auto max-h-full object-contain"
          />
        )}
        {!product.imageUrl && (
          <div className="absolute inset-0 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400">Нет изображения</span>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">Напиток газированный</p>
        <h3 className="font-medium text-lg mb-2">{product.name}</h3>
        <p className="text-xl font-bold text-gray-900 mb-4">{product.price} ₽</p>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || !canAddMore}
        className={`w-full py-2 rounded ${
          isOutOfStock
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : !canAddMore
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-amber-400 hover:bg-amber-500'
        }`}
      >
        {isOutOfStock ? 'Закончился' : canAddMore ? 'Выбрать' : 'Максимум в корзине'}
      </button>
      
      {currentQuantityInCart > 0 && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          В корзине: {currentQuantityInCart}
        </p>
      )}
    </div>
  );
};
