import api from './api';
import { Brand } from '@/types';

export const brandService = {
   //Запрашивает с сервера список всех брендов
  getBrands: async (): Promise<Brand[]> => {
    // Выполняем GET-запрос к эндпоинту `/brands`
    const response = await api.get<Brand[]>('/brands');
    return response.data;
  },
};
