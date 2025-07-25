'use client';

import { useSelector, UseSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFromCart, updateQuantity } from '@/store/cartSlice';
import { CartItem } from '@/components/CartItem';
import { EmptyCart } from '@/components/EmptyCart';
import { RootState } from '@/store';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0));

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  if(cartItems.length === 0) {
    return <EmptyCart/>;
  }

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleQuantityInput = (productId: number, value: string) => {
    const newQuantity = parseInt(value) || 0;
    const item = cartItems.find(i => i.product.id === productId);
    if (item && newQuantity <= item.product.quantity && newQuantity >= 0) {
      handleQuantityChange(productId, newQuantity);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handlePayment = () => {
    router.push('/payment');
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

        {cartItems.length === 0 ? (
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
        ) : (
          <>
            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Товар</th>
                    <th className="text-center p-4">Количество</th>
                    <th className="text-right p-4">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product.id} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-32 object-contain"/>
                          <div>
                            <p className="text-gray-600 text-sm">Напиток газированный</p>
                            <p className="font-medium">{item.product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityInput(item.product.id, e.target.value)}
                            min="1"
                            max={item.product.quantity}
                            className="w-12 text-center border rounded px-2 py-1"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.quantity}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {item.product.price} ₽
                      </td>
                      <td className="p-4">                       
                        <button
                          onClick={() => dispatch(removeFromCart(item.product.id))}
                          className="text-gray-400 hover:text-red-500"
                          title="Удалить товар"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-4 border-t">
                <div className="flex justify-end mb-4">
                  <div className="text-lg">
                    Итоговая сумма: <span className="font-bold">{getTotalPrice().toFixed(2)} ₽</span>
                  </div>
                </div> 

                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-6 py-2 bg-amber-400 text-black rounded hover:bg-amber-500"
                  >
                    Вернуться
                  </button>
                  <button
                    onClick={handlePayment}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Оплата
                  </button>
                </div>
                
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
