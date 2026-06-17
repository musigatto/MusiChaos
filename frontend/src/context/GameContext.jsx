import { createContext, useContext, useState, useCallback } from "react";
import api from "../services/api";
import { ENDPOINTS } from "../utils/constants";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Lobby state
  const [currentLobby, setCurrentLobby] = useState(null);
  const [isHost, setIsHost] = useState(false);

  // Round state
  const [currentRound, setCurrentRound] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Answers state
  const [answers, setAnswers] = useState([]);

  // Scores state
  const [scores, setScores] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Crear lobby
   */
  const createLobby = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(ENDPOINTS.LOBBY.CREATE);
      const lobby = response.data;

      setCurrentLobby(lobby);
      checkIfHost(lobby);

      return { success: true, lobby };
    } catch (err) {
      const errorMsg = err.response?.data || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unirse a lobby
   */
  const joinLobby = async (code) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(ENDPOINTS.LOBBY.JOIN, { code });
      const lobby = response.data;

      setCurrentLobby(lobby);
      checkIfHost(lobby);

      return { success: true, lobby };
    } catch (err) {
      const errorMsg = err.response?.data || "Lobby no encontrado";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Salir del lobby
   */
  const leaveLobby = () => {
    setCurrentLobby(null);
    setIsHost(false);
    setCurrentRound(null);
    setHasAnswered(false);
    setAnswers([]);
    setScores([]);
  };

  /**
   * Cargar lobby por ID
   */
  const loadLobby = async (lobbyId) => {
    try {
      const response = await api.get(ENDPOINTS.LOBBY.GET(lobbyId));
      setCurrentLobby(response.data);
      checkIfHost(response.data);
      return { success: true, lobby: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Cargar puntajes
   */
  const loadScores = async () => {
    if (!currentLobby) return { success: false, error: "No lobby" };

    try {
      const response = await api.get(ENDPOINTS.LOBBY.SCORES(currentLobby.id));
      const scoresData = response.data.sort((a, b) => b.points - a.points);

      setScores(scoresData);
      return { success: true, scores: scoresData };
    } catch (err) {
      console.error("Error loading scores:", err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Crear ronda (HOST)
   */
  const createRound = async (roundNumber, correctAnswer) => {
    if (!currentLobby) return { success: false, error: "No lobby" };

    setLoading(true);

    try {
      const response = await api.post(
        `${ENDPOINTS.ROUNDS.CREATE}?lobbyId=${currentLobby.id}&roundNumber=${roundNumber}&correctAnswer=${encodeURIComponent(correctAnswer)}`,
      );
      const round = response.data;

      setCurrentRound(round);
      setHasAnswered(false);
      setAnswers([]);

      return { success: true, round };
    } catch (err) {
      setError(err.response?.data || err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Iniciar ronda (HOST) - WAITING → ACTIVE
   */
  const startRound = async () => {
    if (!currentRound) return { success: false, error: "No round" };

    try {
      const response = await api.post(ENDPOINTS.ROUNDS.START(currentRound.id));
      setCurrentRound(response.data);
      return { success: true };
    } catch (err) {
      setError(err.response?.data || err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Finalizar ronda (HOST)
   */
  const finishRound = async () => {
    if (!currentRound) return { success: false, error: "No round" };

    try {
      await api.post(ENDPOINTS.ROUNDS.FINISH(currentRound.id));

      // Cargar puntajes actualizados
      await loadScores();

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Enviar respuesta (JUGADOR)
   */
  const submitAnswer = async (username, answer) => {
    if (!currentRound) return { success: false, error: "No round" };
    if (hasAnswered) return { success: false, error: "Already answered" };

    try {
      await api.post(
        `${ENDPOINTS.ROUNDS.SUBMIT_ANSWER(currentRound.id)}?username=${encodeURIComponent(username)}&answer=${encodeURIComponent(answer)}`,
      );

      setHasAnswered(true);

      // Cargar respuestas
      await loadAnswers();

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Cargar respuestas de la ronda
   */
  const loadAnswers = async () => {
    if (!currentRound) return { success: false };

    try {
      const response = await api.get(
        ENDPOINTS.ROUNDS.GET_ANSWERS(currentRound.id),
      );
      setAnswers(response.data);
      return { success: true, answers: response.data };
    } catch (err) {
      console.error("Error loading answers:", err);
      return { success: false, error: err.message };
    }
  };

  // ponytail: assumes first player in array is the host. Ceiling: if player order shifts, host reassigns wrong.
  // Upgrade: store explicit `hostId` on Lobby entity.
  const checkIfHost = (lobby) => {
    const userEmail = localStorage.getItem("user_email");
    if (lobby?.players?.length > 0) {
      const firstPlayer = lobby.players[0];
      setIsHost(firstPlayer.email === userEmail);
    }
  };

  /**
   * Actualizar lobby (desde WebSocket)
   */
  const updateLobby = useCallback((lobbyData) => {
    setCurrentLobby(lobbyData);
    checkIfHost(lobbyData);
  }, []);

  /**
   * Cargar ronda por ID
   */
  const loadRound = async (roundId) => {
    try {
      const response = await api.get(ENDPOINTS.ROUNDS.GET(roundId));
      setCurrentRound(response.data);
      return { success: true, round: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    // State
    currentLobby,
    isHost,
    currentRound,
    hasAnswered,
    answers,
    scores,
    loading,
    error,

    // Lobby actions
    createLobby,
    joinLobby,
    leaveLobby,
    updateLobby,
    loadLobby,

    // Round actions
    createRound,
    startRound,
    finishRound,
    loadRound,

    // Answer actions
    submitAnswer,
    loadAnswers,

    // Score actions
    loadScores,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Hook para usar el contexto del juego
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
