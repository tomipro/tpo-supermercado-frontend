import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./redux/cartSlice";
import categoriesReducer from "./redux/categoriesSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    categorias: categoriesReducer,
  },
});

export default store;