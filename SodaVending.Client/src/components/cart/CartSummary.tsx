interface CartSummaryProps {
  totalPrice: number;
  onBack: () => void;
  onPayment: () => void;
}

export const CartSummary = ({ totalPrice, onBack, onPayment }: CartSummaryProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex justify-end mb-4">
        <div className="text-lg">
          Итоговая сумма: <span className="font-bold">{totalPrice.toFixed(2)} ₽</span>
        </div>
      </div> 

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-amber-400 text-black rounded hover:bg-amber-500"
        >
          Вернуться
        </button>
        <button
          onClick={onPayment}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Оплата
        </button>
      </div>
    </div>
  );
};