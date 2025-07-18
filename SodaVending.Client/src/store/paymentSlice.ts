import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Coin, PaymentCoins, PaymentValidationResult } from '@/types';
import { coinService } from '@/services/coinService';
import { paymentService } from '@/services/paymentService';


interface PaymentState {
  coins: Coin[];
  paymentCoins: PaymentCoins;
  validationResult: PaymentValidationResult | null;
    loading: boolean;
  error: string | null;
}

// Начальное состояние.
const initialState: PaymentState = {
  coins: [],
  paymentCoins: {},
  validationResult: null,
  loading: false,
  error: null,
};


export const fetchCoins = createAsyncThunk(
  'payment/fetchCoins',
  async () => {
    const coins = await coinService.getCoins();
    return coins;
  }
);

export const validatePayment = createAsyncThunk(
  'payment/validate',
  async ({ totalAmount, paymentCoins }: { totalAmount: number; paymentCoins: PaymentCoins }) => {
    const result = await paymentService.validatePayment(totalAmount, paymentCoins);
    return result;
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    updatePaymentCoin: (state, action: PayloadAction<{ denomination: number; quantity: number }>) => {
      const { denomination, quantity } = action.payload;
      if (quantity > 0) {
        state.paymentCoins[denomination] = quantity;
      } else {
        delete state.paymentCoins[denomination];
      }
    },
    resetPayment: (state) => {
      state.paymentCoins = {};
      state.validationResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.loading = false;
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coins';
      })
      .addCase(validatePayment.fulfilled, (state, action) => {
        state.validationResult = action.payload;
      });
  },
});

export const { updatePaymentCoin, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
