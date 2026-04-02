import { useEffect, useRef, useState, useCallback } from "react";
import { wsService } from "../services/websocket";
import { useGame } from "../context/GameContext";

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const { updateLobby, currentLobby, loadAnswers, loadScores, resetRound } =
    useGame();
  const subscriptionsRef = useRef([]);

  /**
   * Conectar al WebSocket
   */
  const connect = useCallback(() => {
    wsService.connect(
      () => {
        setConnected(true);
        addMessage("✅ WebSocket conectado");
      },
      (error) => {
        setConnected(false);
        addMessage("❌ Error WebSocket: " + error);
      },
    );
  }, []);

  /**
   * Desconectar del WebSocket
   */
  const disconnect = useCallback(() => {
    wsService.disconnect();
    setConnected(false);
    subscriptionsRef.current = [];
    addMessage("👋 WebSocket desconectado");
  }, []);

  /**
   * Suscribirse a un lobby específico
   */
  const subscribeToLobby = useCallback(
    (lobbyId) => {
      if (!connected) return;

      // Suscribirse a actualizaciones del lobby
      const subscription = wsService.subscribe(
        `/topic/lobby/${lobbyId}`,
        (data) => {
          addMessage(`📬 Lobby ${lobbyId}: ${data.type}`);
          handleLobbyMessage(data);
        },
      );

      subscriptionsRef.current.push(subscription);
    },
    [connected],
  );

  /**
   * Manejar mensajes del lobby
   */
  const handleLobbyMessage = (data) => {
    switch (data.type) {
      case "NEW_ROUND":
        addMessage("🎯 Nueva ronda iniciada");
        resetRound();
        break;

      case "ANSWER":
        addMessage(`💬 ${data.username} ha respondido`);
        if (currentLobby) {
          loadAnswers();
        }
        break;

      case "ROUND_FINISHED":
        addMessage("✅ Ronda finalizada");
        loadScores();
        break;

      default:
        // Actualizar lobby si es info del lobby
        if (data.id) {
          updateLobby(data);
        }
    }
  };

  /**
   * Añadir mensaje al log
   */
  const addMessage = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [...prev, `[${timestamp}] ${msg}`]);
  };

  /**
   * Limpiar mensajes
   */
  const clearMessages = () => {
    setMessages([]);
  };

  /**
   * Auto-conectar al montar
   */
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  /**
   * Suscribirse automáticamente cuando hay un lobby
   */
  useEffect(() => {
    if (connected && currentLobby) {
      subscribeToLobby(currentLobby.id);
    }
  }, [connected, currentLobby?.id]);

  return {
    connected,
    messages,
    connect,
    disconnect,
    subscribeToLobby,
    clearMessages,
  };
}
