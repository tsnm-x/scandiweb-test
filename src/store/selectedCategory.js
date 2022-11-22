import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: "",
  },
  reducers: {
    setCategory(state, { payload }) {
      state.category = payload;
    },
  },
});

export const categoryActions = categorySlice.actions;

export default categorySlice.reducer;
