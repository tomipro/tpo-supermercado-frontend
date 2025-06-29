import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Traer carrito
export const fetchCarrito = createAsyncThunk(
  "cart/fetchCarrito",
  async (token) => {
    const res = await fetch("http://localhost:4040/carritos", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return { items: [], total: 0 };
    return await res.json();
  }
);

// Sumar/restar cantidad
export const patchCarrito = createAsyncThunk(
  "cart/patchCarrito",
  async ({ token, productoId, cantidad }) => {
    await fetch(
      `http://localhost:4040/carritos/${productoId}?cantidad=${cantidad}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
);

// Eliminar/restar uno
export const deleteCarrito = createAsyncThunk(
  "cart/deleteCarrito",
  async ({ token, productoId }) => {
    await fetch(`http://localhost:4040/carritos/${productoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
);

// Eliminar todos de un producto
export const deleteAllCarrito = createAsyncThunk(
  "cart/deleteAllCarrito",
  async ({ token, productoId, cantidad }) => {
    await fetch(
      `http://localhost:4040/carritos/${productoId}?cantidad=${cantidad}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carrito: { items: [], total: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.carrito = action.payload;
        state.loading = false;
      })
      .addCase(fetchCarrito.rejected, (state) => {
        state.carrito = { items: [], total: 0 };
        state.loading = false;
        state.error = "No se pudo cargar el carrito";
      });
    // patchCarrito, deleteCarrito, deleteAllCarrito no modifican el state directamente
  },
});

export default cartSlice.reducer;
