'use-client';

import { useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from '@/store/cartSlice';
import { CartItem } from "@/types";
import { Product } from '@/types';

interface CartItemRowProps {
    item: CartItem;
    onQuantityChange: (productId: number, newQuantity: number) => void;
    onQuantityInput: (productId: number, value: string) => void;
}

export const CartItemRow = ({ item, onQuantityChange, onQuantityInput }: CartItemRowProps) => {
    const dispatch = useDispatch();

    return (
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
                    onClick={() => onQuantityChange(item.product.id, Math.max(0, item.quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                    -
                    </button>
                    <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onQuantityInput(item.product.id, e.target.value)}
                    min="1"
                    max={item.product.quantity}
                    className="w-12 text-center border rounded px-2 py-1"
                    />
                    <button
                    onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
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
    );
};


