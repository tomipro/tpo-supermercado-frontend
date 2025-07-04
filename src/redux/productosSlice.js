import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { a } from "framer-motion/client";

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
      const res = await axios.get(url);
      if (res.status !== 200) throw new Error("No se pudieron cargar los productos.");
      const data = res.data;
      // Devuelve el objeto completo, no solo el array
      return data;
    } catch (e) {
      return rejectWithValue(e.message || "Error al cargar productos.");
    }
  }
);


// Traer un producto por su ID
export const fetchProductoById = createAsyncThunk(
  "productos/fetchProductoById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:4040/producto/id/${id}`);
      if (res.status !== 200) throw new Error("No se pudo cargar el producto.");
      return res.data; // Un solo producto
    } catch (e) {
      return rejectWithValue(e.message || "Error al cargar producto.");
    }
  }
);


export const deleteProducto = createAsyncThunk(
  "productos/deleteProducto",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`http://localhost:4040/producto/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        return id;
      }
    } catch (e) {
      return rejectWithValue(e.message || "Error al eliminar producto.");
    }
  }
);

export const createProducto = createAsyncThunk(
  "productos/createProducto",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:4040/producto`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 201) {
        return res.data;
      }
      throw new Error("No se pudo crear el producto.");
    } catch (e) {
      return rejectWithValue(e.message || "Error al crear producto.");
    }
  }
);

export const updateProducto = createAsyncThunk(
  "productos/updateProducto",
  async ({ id, data, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:4040/producto/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      return rejectWithValue(e.message || "Error al actualizar producto.");
    }
  }
);

const productosSlice = createSlice({
  name: "productos",
  initialState: {
    productos: [],
    productoDetalle: null,     
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
        // Si viene paginado, guarda el array y los datos extra
        if (action.payload && Array.isArray(action.payload.content)) {
          state.productos = action.payload.content;
          state.paginacion = {
            totalPages: action.payload.totalPages,
            totalElements: action.payload.totalElements,
            page: action.payload.page,
            size: action.payload.size,
          };
        } else if (Array.isArray(action.payload)) {
          state.productos = action.payload;
          state.paginacion = undefined;
        } else {
          state.productos = [];
          state.paginacion = undefined;
        }
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductoById.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.productoDetalle = null;
      })
      .addCase(fetchProductoById.fulfilled, (state, action) => {
        state.loading = false;
        state.productoDetalle = action.payload;
      })
      .addCase(fetchProductoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productoDetalle = null;
      });
  },
});

export const { clearProductosMsg } = productosSlice.actions;
export default productosSlice.reducer;
