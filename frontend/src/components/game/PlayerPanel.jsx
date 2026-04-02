import { useState } from "react";
import { useGame } from "../../context/GameContext";
import "./PlayerPanel.css";

function PlayerPanel() {
  const { currentRound, hasAnswered, submitAnswer, currentLobby } = useGame();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answer.trim()) {
      setFeedback("❌ Escribe una respuesta");
      setFeedbackType("error");
      return;
    }

    const userEmail = localStorage.getItem("user_email");
    const username =
      currentLobby?.players?.find((p) => p.email === userEmail)?.username ||
      userEmail;

    const result = await submitAnswer(username, answer);

    if (result.success) {
      setFeedback("⏳ Respuesta enviada. Esperando resultados...");
      setFeedbackType("waiting");
      setAnswer("");
    } else {
      setFeedback(`❌ Error: ${result.error}`);
      setFeedbackType("error");
    }
  };

  if (!currentRound) {
    return (
      <div className="card">
        <div className="game-panel">
          <h2>🎵 Esperando Ronda</h2>
          <p style={{ color: "rgba(255,255,255,0.8)" }}>
            El host aún no ha creado una ronda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="game-panel">
        <h2>🎵 Ronda Activa</h2>

        <div className="round-info">
          <h3>Ronda #{currentRound.roundNumber}</h3>
          <p style={{ color: "rgba(255,255,255,0.8)" }}>
            {hasAnswered
              ? "Ya has enviado tu respuesta"
              : "¡Escribe tu respuesta!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="answer-input">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            disabled={hasAnswered}
          />
          <button
            type="submit"
            disabled={hasAnswered}
            style={{ marginTop: "8px" }}
          >
            🎤 Enviar Respuesta
          </button>
        </form>

        {feedback && (
          <div className={`answer-feedback answer-${feedbackType}`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerPanel;
