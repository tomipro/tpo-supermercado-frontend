import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./redux/cartSlice";
import categoriesReducer from "./redux/categoriesSlice";
import direccionesReducer from "./redux/direccionesSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    categorias: categoriesReducer,
    direcciones: direccionesReducer,
  },
});

export default store;