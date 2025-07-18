import api from './api';
import { Coin } from '@/types';

export const coinService = {

   //Запрашивает с сервера список всех номиналов монет, которые принимает автомат
  getCoins: async (): Promise<Coin[]> => {
    // Выполняем GET-запрос к эндпоинту `/coins`
    const response = await api.get<Coin[]>('/coins');
    
    return response.data;
  },
};
