import { configureStore } from "@reduxjs/toolkit";
import category from "./selectedCategory";
import currency from "./selectedCurrency";
import cart from "./cart";

const store = configureStore({
  reducer: {
    category,
    currency,
    cart
  }	
});
export default store;
