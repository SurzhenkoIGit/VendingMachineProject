import { Coin, PaymentCoins } from '@/types';

interface CoinRowProps {
  coin: Coin;
  paymentCoins: PaymentCoins;
  onQuantityChange: (denomination: number, quantity: number) => void;
  onQuantityInput: (denomination: number, value: string) => void;
}

export const CoinRow = ({ coin, paymentCoins, onQuantityChange, onQuantityInput }: CoinRowProps) => {
  const currentQuantity = paymentCoins[coin.denomination] || 0;

  return (
    <tr className="border-b">
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
            onClick={() => onQuantityChange(coin.denomination, Math.max(0, currentQuantity - 1))}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-300 flex items-center justify-center"
          >
            -
          </button>
          <input
            type="number"
            value={currentQuantity}
            onChange={(e) => onQuantityInput(coin.denomination, e.target.value)}
            min="0"
            className="w-12 text-center border rounded px-2 py-1"
          />
          <button
            onClick={() => onQuantityChange(coin.denomination, currentQuantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            +
          </button>
        </div>
      </td>
      <td className="p-4 text-right">
        {(currentQuantity * coin.denomination).toFixed(2)} ₽
      </td>
    </tr>
  );
};