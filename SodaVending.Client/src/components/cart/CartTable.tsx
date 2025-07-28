import { CartItem } from '@/types';
import { CartItemRow } from './CartItemRow';

interface CartTableProps {
  items: CartItem[];
  onQuantityChange: (productId: number, newQuantity: number) => void;
  onQuantityInput: (productId: number, value: string) => void;
}

export const CartTable = ({ items, onQuantityChange, onQuantityInput }: CartTableProps) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-4">Товар</th>
          <th className="text-center p-4">Количество</th>
          <th className="text-right p-4">Цена</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <CartItemRow 
            key={item.product.id} 
            item={item}
            onQuantityChange={onQuantityChange}
            onQuantityInput={onQuantityInput}
          />
        ))}
      </tbody>
    </table>
  );
};