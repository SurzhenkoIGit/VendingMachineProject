import api from './api';
import { PaymentValidationResult, PaymentCoins } from '@/types';

export const paymentService = {
  validatePayment: async (totalAmount: number, paymentCoins: PaymentCoins): Promise<PaymentValidationResult> => {
    const response = await api.post<PaymentValidationResult>('/payment/validate', {
      totalAmount,
      paymentCoins,
    });
    return response.data;
  },
};
