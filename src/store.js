import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./redux/cartSlice";
import categoriesReducer from "./redux/categoriesSlice";
import direccionesReducer from "./redux/direccionesSlice";
import usuarioReducer from "./redux/usuarioSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    categorias: categoriesReducer,
    direcciones: direccionesReducer,
    usuario: usuarioReducer,
  },
});

export default store;