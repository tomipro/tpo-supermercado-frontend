import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Traer productos (con filtros opcionales)
export const fetchProductos = createAsyncThunk(
  "productos/fetchProductos",
  async (params = {}, { rejectWithValue }) => {
    try {
      let url = "http://localhost:4040/producto";
      const query = [];
      if (params.nombre) query.push(`nombre=${encodeURIComponent(params.nombre)}`);
      if (params.categoriaId) query.push(`categoriaId=${params.categoriaId}`);
      if (params.subcategoriaId) query.push(`subcategoriaId=${params.subcategoriaId}`);
      if (params.marca) query.push(`marca=${params.marca}`);
      if (params.precioMin) query.push(`precioMin=${params.precioMin}`);
      if (params.precioMax) query.push(`precioMax=${params.precioMax}`);
      if (params.page !== undefined) query.push(`page=${params.page}`);
      if (params.size !== undefined) query.push(`size=${params.size}`);
      if (params.destacados) query.push(`destacados=true`);
      if (params.promo) query.push(`promo=true`);
      if (query.length > 0) url += "?" + query.join("&");
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudieron cargar los productos.");
      const data = await res.json();
      return Array.isArray(data.content) ? data.content : [];
    } catch (e) {
      return rejectWithValue(e.message || "Error al cargar productos.");
    }
  }
);

const productosSlice = createSlice({
  name: "productos",
  initialState: {
    productos: [],
    loading: false,
    error: "",
  },
  reducers: {
    clearProductosMsg(state) {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductosMsg } = productosSlice.actions;
export default productosSlice.reducer;
