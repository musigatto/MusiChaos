import { useGame } from "../../context/GameContext";
import "./ScoresTable.css";

function ScoresTable() {
  const { scores } = useGame();

  if (!scores || scores.length === 0) return null;

  return (
    <div className="card">
      <h2>Tabla de Puntajes</h2>
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
    </div>
  );
}

export default ScoresTable;
