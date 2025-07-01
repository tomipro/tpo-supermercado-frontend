import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const fetchOrdenesUsuario = createAsyncThunk(
  "orden/fetchOrdenesUsuario",
  async ({ token, usuarioId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:4040/ordenes/usuarios/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudieron cargar los pedidos.");
      const data = await res.json();
      // Normalización mínima: soporte para array directo o paginado (content)
      let pedidosData = [];
      if (Array.isArray(data)) pedidosData = data;
      else if (data && Array.isArray(data.content)) pedidosData = data.content;
      // Ordenar por fecha (más nuevo primero)
      const pedidosOrdenados = pedidosData.sort((a, b) => {
        const fechaA = a.fechaCreacion || a.fecha;
        const fechaB = b.fechaCreacion || b.fecha;
        return new Date(fechaB) - new Date(fechaA);
      });
      return pedidosOrdenados;
    } catch (e) {
      return rejectWithValue(e.message || "Error al cargar pedidos.");
    }
  }
);
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

export const fetchPedidoPorId = createAsyncThunk(
  "orden/fetchPedidoPorId",
  async ({ token, usuarioId, pedidoId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:4040/ordenes/${pedidoId}/usuarios/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudo cargar el pedido.");
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message || "Error al cargar el pedido.");
    }
  }
);

const ordenSlice = createSlice({
  name: "orden",
  initialState: {
    orden: null,
    pedidos: [],
    pedido: null,
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
      })
      .addCase(fetchOrdenesUsuario.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchOrdenesUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.pedidos = action.payload; 
      })
      .addCase(fetchOrdenesUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPedidoPorId.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.pedido = null;
      })
      .addCase(fetchPedidoPorId.fulfilled, (state, action) => {
        state.loading = false;
        state.pedido = action.payload;
      })
      .addCase(fetchPedidoPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.pedido = null;
      });
  },
});

export const { clearOrdenMsg } = ordenSlice.actions;
export default ordenSlice.reducer;
