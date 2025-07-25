import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import paymentReducer from './paymentSlice';


export const store = configureStore({
  reducer: {
    products: productReducer, 
    cart: cartReducer,        
    payment: paymentReducer,  
  },
});

export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;
