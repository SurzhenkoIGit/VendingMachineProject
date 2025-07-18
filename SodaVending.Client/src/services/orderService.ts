import api from './api';
import { Order, CreateOrder } from '@/types';

export const orderService = {
  // Отправляет на сервер данные для создания нового заказа
  createOrder: async (createOrderDto: CreateOrder): Promise<Order> => {
    // Выполняем POST-запрос к эндпоинту `/orders`
    const response = await api.post<Order>('/orders', createOrderDto);
    
    return response.data;
  },
  
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },
  
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },
};
