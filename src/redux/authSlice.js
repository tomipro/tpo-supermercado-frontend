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

// Registro de usuario
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4040/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorJson = await res.json();
          throw new Error(errorJson.mensaje || "Error al registrar usuario.");
        } else {
          throw new Error(await res.text() || "Error al registrar usuario.");
        }
      }
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message || "Error al registrar usuario.");
    }
  }
);

// Verificar email para reset password
export const verificarEmailThunk = createAsyncThunk(
  "auth/verificarEmail",
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:4040/usuarios/exists/email/${encodeURIComponent(email)}`
      );
      if (!res.ok) throw new Error("No se pudo verificar el correo.");
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message || "Error al verificar el correo.");
    }
  }
);

// Cambiar contraseña (reset por email)
export const cambiarPasswordThunk = createAsyncThunk(
  "auth/cambiarPassword",
  async ({ email, nuevaContrasena }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:4040/usuarios/cambiar-password?email=${email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nuevaContrasena }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error desconocido.");
      }
      return await res.text();
    } catch (e) {
      return rejectWithValue(e.message || "Error al cambiar la contraseña.");
    }
  }
);

// Cambiar contraseña logueado
export const cambiarPasswordLogThunk = createAsyncThunk(
  "auth/cambiarPasswordLog",
  async ({ token, contrasenaActual, nuevaContrasena }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4040/usuarios/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contrasenaActual,
          nuevaContrasena,
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Error al cambiar la contraseña.");
      return text;
    } catch (e) {
      return rejectWithValue(e.message || "Error al cambiar la contraseña.");
    }
  }
);

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
      })
      // Registro
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verificar email
      .addCase(verificarEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(verificarEmailThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(verificarEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cambiar contraseña (reset)
      .addCase(cambiarPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(cambiarPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(cambiarPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cambiar contraseña logueado
      .addCase(cambiarPasswordLogThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(cambiarPasswordLogThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(cambiarPasswordLogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { restoreAuth, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
