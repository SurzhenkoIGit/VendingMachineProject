'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';

interface CartButtonProps {
  onClick: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const totalItems = useAppSelector((state) => state.cart.totalItems);
  const isDisabled = totalItems === 0;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{ minHeight: '60px', minWidth: '120px'}}
      className={`transition-all ${
        isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
      }`}
    >
      Выбрано: {totalItems}
    </button>
  );
};
