import { Coin, PaymentCoins } from '@/types';
import { CoinRow } from './CoinRow';

interface PaymentFormProps {
  coins: Coin[];
  paymentCoins: PaymentCoins;
  totalPrice: number;
  paymentTotal: number;
  isEnoughMoney: boolean;
  loading: boolean;
  error: string | null;
  onCoinQuantityChange: (denomination: number, quantity: number) => void;
  onCoinInput: (denomination: number, value: string) => void;
  onBack: () => void;
  onPayment: () => void;
}

export const PaymentForm = (props: PaymentFormProps) => {
  const {
    coins,
    paymentCoins,
    totalPrice,
    paymentTotal,
    isEnoughMoney,
    loading,
    error,
    onCoinQuantityChange,
    onCoinInput,
    onBack,
    onPayment,
  } = props;

  return (
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
            <CoinRow
              key={coin.id}
              coin={coin}
              paymentCoins={paymentCoins}
              onQuantityChange={onCoinQuantityChange}
              onQuantityInput={onCoinInput}
            />
          ))}
        </tbody>
      </table>
      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">
            Итоговая сумма: <span className="font-bold">{totalPrice.toFixed(2)} ₽</span>
          </div>
          <div className="text-lg">
            Сумма внесенных монет: <span className={`font-semibold ${isEnoughMoney ? 'text-green-600' : 'text-red-600'}`}>{paymentTotal.toFixed(2)} ₽</span>
          </div>
        </div>
        <div className="flex justify-between">
          <button onClick={onBack} className="px-1 py-2 bg-amber-400 text-black rounded hover:bg-amber-500">
            Вернуться
          </button>
          <button
            onClick={onPayment}
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
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};