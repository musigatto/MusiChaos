export const CONFIG = {
  API_BASE: "", // Vite proxy maneja esto automáticamente
  WS_URL: "/ws",
  POINTS_PER_CORRECT_ANSWER: 10,
  MESSAGE_TIMEOUT: 5000,
  AUTO_REFRESH_ANSWERS_DELAY: 1000,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
  LOBBY: {
    CREATE: "/api/lobby/create",
    JOIN: "/api/lobby/join",
    GET: (id) => `/api/lobby/${id}`,
    SCORES: (id) => `/api/lobby/${id}/scores`,
  },
  ROUNDS: {
    CREATE: "/api/rounds",
    GET: (id) => `/api/rounds/${id}`,
    START: (id) => `/api/rounds/${id}/start`,
    SUBMIT_ANSWER: (id) => `/api/rounds/${id}/answer`,
    FINISH: (id) => `/api/rounds/${id}/finish`,
    GET_ANSWERS: (id) => `/api/rounds/${id}/answers`,
  },
};
