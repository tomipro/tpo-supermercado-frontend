import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Traer perfil de usuario
export const fetchPerfil = createAsyncThunk(
  "usuario/fetchPerfil",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:4040/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo cargar el perfil.");
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message || "Error al cargar perfil.");
    }
  }
);

export const fetchUsuarios = createAsyncThunk(
  "usuario/fetchUsuarios",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4040/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo cargar la lista de usuarios.");
      return await res.json(); // Ajustá según lo que devuelva tu backend (array directo o {content: [...]})
    } catch (e) {
      return rejectWithValue(e.message || "Error al cargar usuarios.");
    }
  }
);

// Editar perfil de usuario
export const updatePerfil = createAsyncThunk(
  "usuario/updatePerfil",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4040/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el perfil.");
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message || "Error al actualizar perfil.");
    }
  }
);

const usuarioSlice = createSlice({
  name: "usuario",
  initialState: {
    perfil: null,
    loading: false,
    error: "",
    success: "",
  },
  reducers: {
    clearUsuarioMsg(state) {
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerfil.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchPerfil.fulfilled, (state, action) => {
        state.loading = false;
        state.perfil = action.payload;
      })
      .addCase(fetchPerfil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePerfil.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = "";
      })
      .addCase(updatePerfil.fulfilled, (state, action) => {
        state.loading = false;
        state.perfil = action.payload;
        state.success = "Perfil actualizado correctamente.";
      })
      .addCase(updatePerfil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsuarioMsg } = usuarioSlice.actions;
export default usuarioSlice.reducer;
