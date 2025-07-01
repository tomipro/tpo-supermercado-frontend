import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import ordenesReducer from "./redux/ordenesSlice";


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    ordenes: ordenesReducer,
    // ...otros reducers si hay...
  },
});
