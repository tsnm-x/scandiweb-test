import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    productsCount: [],
    prices: {},
    totalPrice: {},
    count: 0
  },
  reducers: {
    setCart(state, { payload }) {
      state.products = payload.products;
      state.productsCount = payload.productsCount;
      state.prices = payload.prices;
      state.totalPrice = payload.totalPrice;
      state.count = payload.count;
    }
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
