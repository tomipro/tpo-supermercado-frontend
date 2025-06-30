import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4040/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorJson = await res.json();
          throw new Error(errorJson.mensaje || "Credenciales inválidas.");
        } else {
          throw new Error(await res.text() || "Credenciales inválidas.");
        }
      }
      const data = await res.json();
      // Persistir en localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: data.token, usuario: data.usuario })
      );
      return { token: data.token, usuario: data.usuario };
    } catch (e) {
      return rejectWithValue(e.message || "Error de autenticación.");
    }
  }
);

// Logout (solo limpia el estado)
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("auth");
});

const initialState = (() => {
  const persisted = localStorage.getItem("auth");
  if (persisted) {
    try {
      const { token, usuario } = JSON.parse(persisted);
      return {
        token,
        usuario,
        loading: false,
        error: "",
        isAuthenticated: !!token,
      };
    } catch {
      return {
        token: null,
        usuario: null,
        loading: false,
        error: "",
        isAuthenticated: false,
      };
    }
  }
  return {
    token: null,
    usuario: null,
    loading: false,
    error: "",
    isAuthenticated: false,
  };
})();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreAuth(state, action) {
      state.token = action.payload.token;
      state.usuario = action.payload.usuario;
      state.isAuthenticated = !!action.payload.token;
      state.error = "";
    },
    clearAuthError(state) {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.usuario = action.payload.usuario;
        state.isAuthenticated = true;
        state.error = "";
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.usuario = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.token = null;
        state.usuario = null;
        state.isAuthenticated = false;
        state.error = "";
      });
  },
});

export const { restoreAuth, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
