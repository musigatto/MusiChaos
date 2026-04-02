import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ENDPOINTS } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("jwt_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Registrar nuevo usuario
   */
  const register = async (email, username, password) => {
    setLoading(true);
    setError(null);

    try {
      await api.post(ENDPOINTS.AUTH.REGISTER, { email, username, password });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Iniciar sesión
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token: newToken } = response.data;

      setToken(newToken);
      localStorage.setItem("jwt_token", newToken);

      // Guardar info del usuario
      setUser({ email });

      return { success: true, token: newToken };
    } catch (err) {
      const errorMsg = err.response?.data || "Credenciales inválidas";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt_token");
  };

  /**
   * Verificar si está autenticado
   */
  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    token,
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
