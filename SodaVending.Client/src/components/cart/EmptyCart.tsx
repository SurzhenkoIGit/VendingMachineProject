'use-client';
import { useRouter } from 'next/navigation';

export const EmptyCart = () => {
    const router = useRouter();
    
    return (
         <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">
              Товар не выбран, вернитесь на страницу каталога
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Перейти в каталог
            </button>
          </div>
    )

}