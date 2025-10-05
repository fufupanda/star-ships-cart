import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStarShip } from './productsSlice';

export enum PAYMENT_METHODS_TYPE {
  NET_BANKING = 'net_banking',
  COD = 'cash_on_delivery'
}

interface ICartItem extends IStarShip {
  quantity: number;
  image?: string;
  maxQuantity: number;
}

interface ICartState {
  items: ICartItem[];
  total: number;
  itemCount: number;
  paymentMethod: PAYMENT_METHODS_TYPE;
}

const initialState: ICartState = {
  items: [],
  total: 0,
  itemCount: 0,
  paymentMethod: PAYMENT_METHODS_TYPE.COD,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<ICartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.name === action.payload.name);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (Number(item.cost_in_credits) * item.quantity), 0);
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.name !== action.payload);
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (Number(item.cost_in_credits) * item.quantity), 0);
    },
    
    updateQuantity: (state, action: PayloadAction<{ name: string; quantity: number }>) => {
      const item = state.items.find(item => item.name === action.payload.name);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        
        // Remove item if quantity is 0
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.name !== action.payload.name);
        }
      }
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (Number(item.cost_in_credits) * item.quantity), 0);
    },

    updatePaymentMethod: (state, action: PayloadAction<PAYMENT_METHODS_TYPE>) => {
      state.paymentMethod = action.payload;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, updatePaymentMethod } = cartSlice.actions;
export default cartSlice.reducer;
