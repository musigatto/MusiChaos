function WebSocketStatus({ connected }) {
  return (
    <div
      className={`ws-status ${connected ? "ws-connected" : "ws-disconnected"}`}
    >
      {connected ? "● Conectado" : "● Desconectado"}
    </div>
  );
}

export default WebSocketStatus;
