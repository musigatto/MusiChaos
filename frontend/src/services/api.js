import axios from "axios";

// Crear instancia de axios
const api = axios.create({
  baseURL: "", // Vite proxy maneja esto
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("jwt_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
