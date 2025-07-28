'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchCoins, updatePaymentCoin, resetPayment } from '@/store/paymentSlice';
import { clearCart } from '@/store/cartSlice';
import { orderService } from '@/services/orderService';
import { Order, CreateOrder } from '@/types';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { PaymentResult } from '@/components/payment/PaymentResult';

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
        orderItems: cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity })),
        paymentCoins
      };
      const order = await orderService.createOrder(createOrder);
      setOrderResult(order);
      setShowResult(true);
      dispatch(clearCart());
    } catch (err: any) {
      setError(err.response?.data?.error || 'Произошла ошибка при оформлении заказа');
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

  return (
    <main className="min-h-screen p-8">
      {showResult && orderResult ? (
        <PaymentResult orderResult={orderResult} onBackToCatalog={handleBackToCatalog} />
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium mb-6">Оплата</h1>
          <PaymentForm
            coins={coins}
            paymentCoins={paymentCoins}
            totalPrice={totalPrice}
            paymentTotal={paymentTotal}
            isEnoughMoney={isEnoughMoney}
            loading={loading}
            error={error}
            onCoinQuantityChange={handleCoinQuantityChange}
            onCoinInput={handleCoinInput}
            onBack={handleBack}
            onPayment={handlePayment}
          />
        </div>
      )}
    </main>
  );
}
