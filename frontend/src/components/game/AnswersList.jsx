import { useGame } from "../../context/GameContext";
import "./AnswersList.css";

function AnswersList() {
  const { answers, loadAnswers, currentRound } = useGame();

  const handleRefresh = () => {
    loadAnswers();
  };

  if (!currentRound) return null;

  return (
    <div className="card">
      <div className="game-panel">
        <h2>📝 Respuestas de Jugadores</h2>

        <div className="answers-list">
          {answers.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.7)" }}>
              Aún no hay respuestas
            </p>
          ) : (
            answers.map((answer, index) => (
              <div
                key={index}
                className={`answer-item ${answer.correct ? "correct" : "incorrect"}`}
              >
                <span>
                  <strong>{answer.username}</strong>: {answer.answer}
                </span>
                <span>{answer.correct ? "✅" : "❌"}</span>
              </div>
            ))
          )}
        </div>

        <button onClick={handleRefresh} style={{ marginTop: "12px" }}>
          🔄 Actualizar Respuestas
        </button>
      </div>
    </div>
  );
}

export default AnswersList;
