'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { removeFromCart, updateQuantity } from '@/store/cartSlice';
import { CartTable } from '@/components/cart/CartTable';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { RootState } from '@/store';


export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };


  const handlePayment = () => {
    router.push('/payment');
  };


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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="bg-white rounded-lg shadow">
            <CartTable 
              items={cartItems}
              onQuantityChange={handleQuantityChange}
              onQuantityInput={handleQuantityInput}
            />
            <CartSummary 
              totalPrice={getTotalPrice()}
              onBack={handleBack}
              onPayment={handlePayment}
            />
          </div>
        )}
      </div>
    </main>
  );
}
