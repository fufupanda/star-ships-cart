import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG } from '../config/api';
import { getApiUrl } from '../services/api.service';

export interface IStarShip {
  name: string;
  cost_in_credits: string;
}

interface ISWAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IStarShip[];
}

interface IProductMaxQuantities {
  [productName: string]: number;
}

interface IProductsState {
  data?: ISWAPIResponse;
  searchData?: ISWAPIResponse;
  loading: boolean;
  searchLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchError: string | null;
  maxQuantities: IProductMaxQuantities;
}

const initialState: IProductsState = {
  data: undefined,
  searchData: undefined,
  loading: false,
  searchLoading: false,
  loadingMore: false,
  error: null,
  searchError: null,
  maxQuantities: {},
};

// Helper function to generate random maxQuantities for products
const generateMaxQuantities = (products: IStarShip[], existingQuantities: IProductMaxQuantities = {}): IProductMaxQuantities => {
  const newQuantities = { ...existingQuantities };
  
  products.forEach((product) => {
    // Only generate if we don't already have a maxQuantity for this product
    if (!newQuantities[product.name]) {
      newQuantities[product.name] = Math.floor(Math.random() * 10) + 1;
    }
  });
  
  return newQuantities;
};

// Function to fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    try {      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch starships');
      }
      
      const data: ISWAPIResponse = await response.json();

      return data
    } catch (error) {
      throw error;
    }
  }
);

// Function to fetch more products (pagination)
export const loadMoreProducts = createAsyncThunk(
  'products/loadMoreProducts',
  async (nextUrl: string) => {
    try {      
      const response = await fetch(nextUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load more starships');
      }
      
      const data: ISWAPIResponse = await response.json();

      return data
    } catch (error) {
      throw error;
    }
  }
);

// Function to fetch products by searching products by name
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchQuery: string) => {
    try {      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCT_BY_NAME(searchQuery)), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to search starships');
      }
      
      const data: ISWAPIResponse = await response.json();

      return data
    } catch (error) {
      throw error;
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.data = undefined;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchData = undefined;
      state.searchError = null;
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
        state.data = action.payload;
        state.error = null;
        // Generate maxQuantities for new products
        if (action.payload?.results) {
          state.maxQuantities = generateMaxQuantities(action.payload.results, state.maxQuantities);
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load starships';
      })
      .addCase(loadMoreProducts.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (state.data && action.payload) {
          state.data.results = [...state.data.results, ...action.payload.results]; // Append new results to existing ones
          state.data.next = action.payload.next;
          // Generate maxQuantities for new products from pagination
          state.maxQuantities = generateMaxQuantities(action.payload.results, state.maxQuantities);
        }
      })
      .addCase(loadMoreProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message || 'Failed to load more products';
      })
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchData = action.payload;
        state.searchError = null;
        // Generate maxQuantities for search results
        if (action.payload?.results) {
          state.maxQuantities = generateMaxQuantities(action.payload.results, state.maxQuantities);
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || 'Search failed';
      });
  },
});

export const { clearProducts, clearSearchResults } = productsSlice.actions;
export default productsSlice.reducer;

