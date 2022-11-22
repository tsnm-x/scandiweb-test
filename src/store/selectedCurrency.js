import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currency: "",
  },
  reducers: {
    setCurrency(state, { payload }) {
      state.currency = payload;
    },
  },
});

export const currencyActions = currencySlice.actions;

export default currencySlice.reducer;
