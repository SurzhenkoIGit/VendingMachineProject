import { Order } from '@/types';

interface PaymentResultProps {
  orderResult: Order;
  onBackToCatalog: () => void;
}

export const PaymentResult = ({ orderResult, onBackToCatalog }: PaymentResultProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Спасибо за покупку!</h2>

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
          <p className="text-xl mb-6">Оплачено без сдачи!</p>
        )}

        <button
          onClick={onBackToCatalog}
          className="px-6 py-3 bg-amber-400 text-white font-semibold rounded-md hover:bg-amber-500 transition-colors">
          Каталог напитков
        </button>
      </div>
    </div>
  );
};