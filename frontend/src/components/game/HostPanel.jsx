import { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import "./HostPanel.css";

function HostPanel() {
  const { createRound, finishRound, currentRound } = useGame();
  const [roundNumber, setRoundNumber] = useState(1);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateRound = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!correctAnswer.trim()) {
      setMessage("❌ Debes especificar la respuesta correcta");
      return;
    }

    const result = await createRound(roundNumber, correctAnswer);

    if (result.success) {
      setMessage(`✅ Ronda ${roundNumber} creada`);
      setRoundNumber((prev) => prev + 1);
      setCorrectAnswer("");
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
  };

  const handleFinishRound = async () => {
    const result = await finishRound();

    if (result.success) {
      setMessage("✅ Ronda finalizada");
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
  };

  return (
    <div className="card">
      <div className="game-panel">
        <h2>🎮 Control del Host</h2>

        <div className="host-controls">
          <h3>Crear Nueva Ronda</h3>
          <form onSubmit={handleCreateRound}>
            <div className="form-group">
              <label style={{ color: "white" }}>Número de Ronda</label>
              <input
                type="number"
                value={roundNumber}
                onChange={(e) => setRoundNumber(Number(e.target.value))}
                min="1"
                style={{ width: "auto" }}
              />
            </div>

            <div className="form-group">
              <label style={{ color: "white" }}>Respuesta Correcta</label>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Ej: Bohemian Rhapsody"
              />
            </div>

            <button type="submit">🎯 Crear Ronda</button>
          </form>

          <hr
            style={{ margin: "20px 0", borderColor: "rgba(255,255,255,0.2)" }}
          />

          <h3>Ronda Actual</h3>
          <div className="current-round-info">
            {currentRound ? (
              <>
                <p>
                  <strong>Ronda #{currentRound.roundNumber}</strong>
                </p>
                <p>ID: {currentRound.id}</p>
                <p>Respuesta: {currentRound.correctAnswer}</p>
                <p>Estado: {currentRound.status}</p>
              </>
            ) : (
              <p style={{ color: "rgba(255,255,255,0.7)" }}>
                No hay ronda activa
              </p>
            )}
          </div>

          <button onClick={handleFinishRound} disabled={!currentRound}>
            ✅ Finalizar Ronda
          </button>

          {message && (
            <div
              className="host-message"
              style={{
                marginTop: "12px",
                padding: "12px",
                background: message.includes("✅")
                  ? "rgba(40, 167, 69, 0.2)"
                  : "rgba(220, 53, 69, 0.2)",
                borderRadius: "6px",
                color: "white",
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HostPanel;
