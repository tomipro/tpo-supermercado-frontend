// src/redux/ordenSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const crearOrden = createAsyncThunk(
  "orden/crearOrden",
  async ({ token, direccionId }, { rejectWithValue }) => {
    try {
      const body = direccionId ? { direccionId } : {};
      const res = await fetch("http://localhost:4040/ordenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("No se pudo finalizar la compra");
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message || "No se pudo finalizar la compra");
    }
  }
);

const ordenSlice = createSlice({
  name: "orden",
  initialState: {
    orden: null,
    loading: false,
    error: "",
  },
  reducers: {
    clearOrdenMsg(state) {
      state.error = "";
      state.orden = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(crearOrden.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(crearOrden.fulfilled, (state, action) => {
        state.loading = false;
        state.orden = action.payload;
      })
      .addCase(crearOrden.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrdenMsg } = ordenSlice.actions;
export default ordenSlice.reducer;
