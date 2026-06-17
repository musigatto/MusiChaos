import { useGame } from "../../context/GameContext";
import "./ScoresTable.css";

function ScoresTable() {
  const { scores } = useGame();

  return (
    <div className="card">
      <h2>🏆 Tabla de Puntajes</h2>
      {!scores || scores.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.7)" }}>Aún no hay puntajes</p>
      ) : (
        <table className="scores-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{score.username}</td>
                <td>
                  <strong>{score.points}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ScoresTable;
