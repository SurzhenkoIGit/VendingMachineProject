'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, fetchBrands, fetchPriceRange } from '@/store/productSlice';
import { Filters } from '@/components/Filters';
import { ProductGrid } from '@/components/ProductGrid';
import { CartButton } from '@/components/CartButton';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, filter, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchBrands()); // Загружаем список брендов для фильтра
    dispatch(fetchPriceRange()); // Загружаем диапазон цен
    dispatch(fetchProducts(filter)); // Загружаем первоначальный список всех продуктов
  }, [dispatch]);

  // Обработчик клика по кнопке Выбрано.
  const handleCartClick = () => {
    router.push('/cart'); // для перехода на страницу корзины.
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-start">Газированные напитки</h1>

        <div className='flex flex-row justify-between items-center bg-white rounded-lg shadow pr-6 mb-5'>

          <Filters />

          <CartButton onClick={handleCartClick} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Загрузка...</div>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

      </div>
    </main>
  );
}
