import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilter, Brand, PriceRange } from '@/types';
import { productService } from '@/services/productService';
import { brandService } from '@/services/brandService';


interface ProductState {
  products: Product[];
  brands: Brand[];
  priceRange: PriceRange;
  filter: ProductFilter;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  brands: [],
  priceRange: { minPrice: 0, maxPrice: 1000 }, 
  filter: {}, 
  loading: false,
  error: null,
};


export const fetchProducts = createAsyncThunk(
  'products/fetchProducts', 
  async (filter: ProductFilter) => {
    const products = await productService.getProducts(filter);
    return products; 
  }
);

export const fetchBrands = createAsyncThunk(
  'products/fetchBrands',
  async () => {
    const brands = await brandService.getBrands();
    return brands;
  }
);

export const fetchPriceRange = createAsyncThunk(
  'products/fetchPriceRange',
  async (brandId?: number) => {
    const priceRange = await productService.getPriceRange(brandId);
    return priceRange;
  }
);


const productSlice = createSlice({
  name: 'products',
  initialState,
 
  reducers: {
    setFilter: (state, action: PayloadAction<ProductFilter>) => {
      state.filter = action.payload;
    },
    setBrandFilter: (state, action: PayloadAction<number | undefined>) => {
      state.filter.brandId = action.payload;
    },
    setPriceFilter: (state, action: PayloadAction<{ minPrice?: number; maxPrice?: number }>) => {
      state.filter.minPrice = action.payload.minPrice;
      state.filter.maxPrice = action.payload.maxPrice;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      })
      .addCase(fetchPriceRange.fulfilled, (state, action) => {
        state.priceRange = action.payload;
      });
  },
});

export const { setFilter, setBrandFilter, setPriceFilter } = productSlice.actions;

export default productSlice.reducer;
