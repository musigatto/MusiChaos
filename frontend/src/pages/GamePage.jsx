import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { useWebSocket } from "../hooks/useWebSocket";
import { useNavigate } from "react-router-dom";

// Componentes (los crearemos en la siguiente parte)
import LobbyManager from "../components/lobby/LobbyManager";
import LobbyInfo from "../components/lobby/LobbyInfo";
import HostPanel from "../components/game/HostPanel";
import PlayerPanel from "../components/game/PlayerPanel";
import AnswerList from "../components/game/AnswersList";
import ScoresTable from "../components/game/ScoresTable";
import WebSocketStatus from "../components/common/WebSocketStatus";

import "./GamePage.css";

function GamePage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { currentLobby, isHost, scores } = useGame();
  const { connected, messages } = useWebSocket();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="game-page">
      <WebSocketStatus connected={connected} />

      <div className="container">
        <div className="game-header">
          <h1>🎵 MusiChaos</h1>
          <button onClick={handleLogout} className="btn-danger">
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Gestión de Lobbies */}
        <LobbyManager />

        {/* Info del Lobby Actual */}
        {currentLobby && <LobbyInfo />}

        {/* Panel del Host */}
        {currentLobby && isHost && <HostPanel />}

        {/* Panel del Jugador */}
        {currentLobby && !isHost && <PlayerPanel />}

        {/* Lista de Respuestas */}
        {currentLobby && <AnswerList />}

        {/* Tabla de Puntajes */}
        {currentLobby && scores.length > 0 && <ScoresTable />}

        {/* Log de Mensajes WebSocket */}
        <div className="card">
          <h2>Mensajes en Tiempo Real</h2>
          <div className="message-log">
            {messages.length === 0 ? (
              <p style={{ color: "#999" }}>Esperando mensajes...</p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="log-message">
                  {msg}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
