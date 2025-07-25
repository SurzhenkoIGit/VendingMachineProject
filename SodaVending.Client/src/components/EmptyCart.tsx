'use-client';
import { useRouter } from 'next/navigation';

export const EmptyCart = () => {
    const router = useRouter();
    
    return (
        <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">Ваша корзина пуста</h2>
            <p className="mb-6">Добавьте товары из каталога, чтобы сделать заказ</p>
            <button onClick={() => router.push('/')} className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
                Вернуться в каталог
            </button>
        </div>
    )

}