import { useState } from "react";
import { useGame } from "../../context/GameContext";

function LobbyManager() {
  const { createLobby, joinLobby, loading } = useGame();
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateLobby = async () => {
    setMessage("");
    const result = await createLobby();

    if (result.success) {
      setMessage(`✅ Lobby creado con código: ${result.lobby.code}`);
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
  };

  const handleJoinLobby = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!joinCode.trim()) {
      setMessage("❌ Introduce un código válido");
      return;
    }

    const result = await joinLobby(joinCode);

    if (result.success) {
      setMessage(`✅ Te uniste al lobby: ${result.lobby.code}`);
      setJoinCode("");
    } else {
      setMessage(`❌ ${result.error}`);
    }
  };

  return (
    <>
      <div className="card">
        <h2>Gestión de Lobbies</h2>
        <button onClick={handleCreateLobby} disabled={loading}>
          🎮 Crear Nuevo Lobby
        </button>
      </div>

      <div className="card">
        <h2>Unirse a Lobby</h2>
        <form onSubmit={handleJoinLobby}>
          <div className="form-group">
            <label>Código del Lobby</label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Ej: ABCD1234"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            👥 Unirse al Lobby
          </button>
        </form>

        {message && (
          <div
            className={`alert ${message.includes("✅") ? "alert-success" : "alert-error"}`}
          >
            {message}
          </div>
        )}
      </div>
    </>
  );
}

export default LobbyManager;
