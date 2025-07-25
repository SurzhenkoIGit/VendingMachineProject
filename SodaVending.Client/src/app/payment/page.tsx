'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchCoins, updatePaymentCoin, resetPayment } from '@/store/paymentSlice';
import { clearCart } from '@/store/cartSlice';
import { orderService } from '@/services/orderService';
import { Order, CreateOrder, PaymentCoins } from '@/types';

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { coins, paymentCoins } = useAppSelector((state) => state.payment);
  const [showResult, setShowResult] = useState(false);
  const [orderResult, setOrderResult] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length === 0 && !showResult) {
      router.push('/cart');
      return;
    }
    dispatch(fetchCoins());
    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch, cartItems, router, showResult]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getPaymentTotal = () => {
    return Object.entries(paymentCoins).reduce((total, [denom, qty]) => {
      return total + (parseInt(denom) * qty);
    }, 0);
  };

  const handleCoinQuantityChange = (denomination: number, quantity: number) => {
    dispatch(updatePaymentCoin({ denomination, quantity }));
  };

  const handleCoinInput = (denomination: number, value: string) => {
    const quantity = parseInt(value) || 0;
    if (quantity >= 0) {
      handleCoinQuantityChange(denomination, quantity);
    }
  };

  const handleBack = () => {
    router.push('/cart');
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const createOrder: CreateOrder = {
        orderItems: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        paymentCoins
      };

      const order = await orderService.createOrder(createOrder);
      setOrderResult(order);
      setShowResult(true);
      dispatch(clearCart());
    } catch (err: any) {
      if (err.response?.data?.cannotMakeChange) {
        setError(err.response.data.error);
      } else {
        setError('Произошла ошибка при оформлении заказа');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCatalog = () => {
    router.push('/');
  };

  const totalPrice = getTotalPrice();
  const paymentTotal = getPaymentTotal();
  const isEnoughMoney = paymentTotal >= totalPrice;

  if (showResult && orderResult) {
    
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Спасибо за покупку!
            </h2>

            {orderResult.changeAmount > 0 ? (
              <>
                <p className="text-xl mb-6">
                  Пожалуйста, возьмите вашу сдачу: {orderResult.changeAmount} руб.
                </p>

                <p className="text-lg font-medium mb-4">Ваши монеты:</p>
            
                <div className="flex flex-col items-center gap-3 mb-8">
                  {[1, 2, 5, 10].map((denomination) => (
                    <div key={denomination} className="flex items-center gap-3 w-32">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-lg">{denomination}</span>
                      </div>
                      <span className="text-lg">
                        {(orderResult.changeCoins?.[denomination] || 0)} шт.
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
                <p className="text-xl mb-6">
                  Оплачено без сдачи!
                </p>
            )}

            <button
              onClick={handleBackToCatalog}
              className="px-6 py-3 bg-amber-400 text-white font-semibold rounded-md hover:bg-amber-500 transition-colors"
            >
              Каталог напитков
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">Оплата</h1>

          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Номинал</th>
                  <th className="text-center p-4">Количество</th>
                  <th className="text-right p-4">Сумма</th>
                </tr>
              </thead>

              <tbody>
                {coins.map((coin) => (
                  <tr key={coin.id} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full font-semibold bg-gray-300 flex items-center justify-center">
                          {coin.denomination}
                        </div>
                        <span>{coin.denomination} ₽</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleCoinQuantityChange(coin.denomination, Math.max(0, (paymentCoins[coin.denomination] || 0) - 1))}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={paymentCoins[coin.denomination] || 0}
                          onChange={(e) => handleCoinInput(coin.denomination, e.target.value)}
                          min="0"
                          className="w-12 text-center border rounded px-2 py-1"
                        />
                        <button
                          onClick={() => handleCoinQuantityChange(coin.denomination, (paymentCoins[coin.denomination] || 0) + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                        {((paymentCoins[coin.denomination] || 0) * coin.denomination).toFixed(2)} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg">
                  Итоговая сумма: <span className="font-bold">{totalPrice.toFixed(2)} ₽</span>
                </div>
                <div className="text-lg">
                  Сумма внесенных монет: <span className={`font-semibold ${isEnoughMoney ? 'text-green-600' : 'text-red-600'}`}>{paymentTotal.toFixed(2)} ₽

                  </span>
                </div>
              </div>
              {/* {isEnoughMoney && paymentTotal > totalPrice && (
                <div className="flex justify-between">
                  <span>Сдача:</span>
                  <span className="font-semibold">{(paymentTotal - totalPrice).toFixed(2)} ₽</span>
                </div>
              )} */}

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-1 py-2 bg-amber-400 text-black rounded hover:bg-amber-500"
                >
                  Вернуться
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!isEnoughMoney || loading}
                  className={`px-1 py-3 rounded ${
                    isEnoughMoney && !loading
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Обработка...' : 'Оплатить'}
                </button>
              </div>
            </div>
              {/* {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )} */} 
          </div>
      </div>
    </main>
  );
}
