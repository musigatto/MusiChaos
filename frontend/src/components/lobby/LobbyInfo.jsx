import { useGame } from "../../context/GameContext";
import "./LobbyInfo.css";

function LobbyInfo() {
  const { currentLobby, leaveLobby, loadScores } = useGame();

  if (!currentLobby) return null;

  const handleLoadScores = async () => {
    await loadScores();
  };

  return (
    <div className="card">
      <h2>Lobby Actual</h2>
      <div className="lobby-info">
        <p>
          <strong>ID:</strong> {currentLobby.id}
        </p>
        <p>
          <strong>Código:</strong> {currentLobby.code}
        </p>
        <p>
          <strong>Nombre:</strong> {currentLobby.name}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          {currentLobby.started ? (
            <span className="badge badge-success">En partida</span>
          ) : (
            <span className="badge badge-warning">En espera</span>
          )}
        </p>
        <p>
          <strong>Jugadores ({currentLobby.players?.length || 0}):</strong>
        </p>
        {currentLobby.players && currentLobby.players.length > 0 ? (
          <ul className="player-list">
            {currentLobby.players.map((player, index) => (
              <li key={index}>{player.username || player.email}</li>
            ))}
          </ul>
        ) : (
          <p>No hay jugadores aún</p>
        )}
      </div>
      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <button onClick={handleLoadScores}>📊 Cargar Puntajes</button>
        <button onClick={leaveLobby} className="btn-danger">
          ❌ Salir del Lobby
        </button>
      </div>
    </div>
  );
}

export default LobbyInfo;
