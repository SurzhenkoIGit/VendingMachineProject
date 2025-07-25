'use-client';

import { useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from '@/store/cartSlice';
import { Product } from '@/types';

interface CartItemProps {
    item: {
        product: Product,
        quantity: number
    };
}

export const CartItem = ({ item } : CartItemProps) => {
    const dispatch = useDispatch();

    const handleIncrease = () => {
        const newQuantity = item.quantity + 1;

        if(newQuantity <= item.product.quantity) {
            dispatch(updateQuantity({ productId: item.product.id, quantity: newQuantity }));
        }
    };

    const handleDecresae = () => {
        const newQuantity = item.quantity - 1;
        if(newQuantity > 0) {
            dispatch(updateQuantity({ productId: item.product.id, quantity: newQuantity}));
        } else {
            dispatch(removeFromCart(item.product.id));
        }
    };

    const handleRemove = () => {
        dispatch(removeFromCart(item.product.id));
    };

    return (
        <div className="flex justify-between items-center border-b py-4">
            <div className="flex items-center w-1/3">
                <span className="font-semibold ml-4">{item.product.name}</span>
            </div>
            <div className="flex items-center justify-end w-2/3">
                <button onClick={handleDecresae} className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300">-</button>
                <span className="w-12 text-center bg-gray-100 py-1">{item.quantity}</span>
                <button onClick={handleIncrease} className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300">+</button>
                <span className="w-24 text-right font-bold mx-4">{(item.product.price * item.quantity).toFixed(2)}</span>
                <button onClick={handleRemove} className="ml-4 text-red-500 hover:text-red-700 font-medium">Удалить</button>
            </div>
        </div>
    )
}