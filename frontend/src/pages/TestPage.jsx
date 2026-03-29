import { useState, useEffect } from "react";
import api from "../services/api";
import { wsService } from "../services/websocket";
import { ENDPOINTS } from "../utils/constants";
import "./TestPage.css";

function TestPage() {
  const [apiStatus, setApiStatus] = useState("⏳ Verificando...");
  const [wsStatus, setWsStatus] = useState("🔴 Desconectado");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("jwt_token"));
  const [wsMessages, setWsMessages] = useState([]);

  // Verificar conexión al backend
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Intenta hacer ping al backend
        await api.get("/api/auth/login");
        setApiStatus("✅ Backend conectado");
      } catch (error) {
        if (error.response) {
          setApiStatus("✅ Backend conectado (esperaba error 401)");
        } else {
          setApiStatus(
            "❌ Backend NO conectado - ¿Está corriendo en puerto 8080?",
          );
        }
      }
    };
    checkBackend();
  }, []);

  // Conectar WebSocket
  const connectWS = () => {
    wsService.connect(
      () => {
        setWsStatus("🟢 Conectado");
        addWsMessage("✅ WebSocket conectado exitosamente");

        // Suscribirse a topic de prueba
        wsService.subscribe("/topic/lobby", (data) => {
          addWsMessage("📨 Mensaje recibido: " + JSON.stringify(data));
        });
      },
      (error) => {
        setWsStatus("🔴 Error");
        addWsMessage("❌ Error: " + error);
      },
    );
  };

  const disconnectWS = () => {
    wsService.disconnect();
    setWsStatus("🔴 Desconectado");
    addWsMessage("👋 WebSocket desconectado");
  };

  const addWsMessage = (msg) => {
    setWsMessages((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);
  };

  // Probar registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("⏳ Registrando...");

    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, {
        email,
        username,
        password,
      });

      setMessage("✅ Registro exitoso! Ahora haz login.");
    } catch (error) {
      setMessage("❌ Error: " + (error.response?.data || error.message));
    }
  };

  // Probar login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("⏳ Iniciando sesión...");

    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token: newToken } = response.data;
      localStorage.setItem("jwt_token", newToken);
      setToken(newToken);
      setMessage("✅ Login exitoso! Token guardado.");
    } catch (error) {
      setMessage("❌ Error: " + (error.response?.data || error.message));
    }
  };

  // Probar crear lobby (requiere token)
  const handleCreateLobby = async () => {
    setMessage("⏳ Creando lobby...");

    try {
      const response = await api.post(ENDPOINTS.LOBBY.CREATE);
      setMessage("✅ Lobby creado: " + JSON.stringify(response.data));
      addWsMessage("🎮 Lobby creado con código: " + response.data.code);
    } catch (error) {
      setMessage("❌ Error: " + (error.response?.data || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    setMessage("👋 Sesión cerrada");
  };

  return (
    <div className="test-container">
      <h1>🧪 MusiChaos - Test Page</h1>

      {/* Estado de Conexiones */}
      <div className="card">
        <h2>Estado de Conexiones</h2>
        <div className="status-item">
          <strong>Backend (API):</strong> {apiStatus}
        </div>
        <div className="status-item">
          <strong>WebSocket:</strong> {wsStatus}
        </div>
        <div className="button-group">
          <button onClick={connectWS} disabled={wsStatus.includes("Conectado")}>
            Conectar WebSocket
          </button>
          <button
            onClick={disconnectWS}
            disabled={!wsStatus.includes("Conectado")}
            className="btn-danger"
          >
            Desconectar WebSocket
          </button>
        </div>
      </div>

      {/* Autenticación */}
      <div className="card">
        <h2>🔐 Probar Autenticación</h2>

        {token ? (
          <div>
            <div className="alert alert-success">
              ✅ Token JWT guardado: {token.substring(0, 20)}...
            </div>
            <button onClick={handleLogout} className="btn-danger">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@test.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="testuser"
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                required
              />
            </div>

            <div className="button-group">
              <button type="button" onClick={handleRegister}>
                Registrarse
              </button>
              <button type="submit" className="btn-primary">
                Login
              </button>
            </div>
          </form>
        )}

        {message && (
          <div
            className={`alert ${message.includes("✅") ? "alert-success" : "alert-error"}`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Probar API con Token */}
      {token && (
        <div className="card">
          <h2>🎮 Probar API Protegida</h2>
          <button onClick={handleCreateLobby} className="btn-primary">
            Crear Lobby de Prueba
          </button>
        </div>
      )}

      {/* Log de WebSocket */}
      <div className="card">
        <h2>📡 Log de WebSocket</h2>
        <div className="ws-log">
          {wsMessages.length === 0 ? (
            <p style={{ color: "#999" }}>Esperando mensajes...</p>
          ) : (
            wsMessages.map((msg, i) => (
              <div key={i} className="log-message">
                {msg}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="card">
        <h2>📋 Instrucciones</h2>
        <ol>
          <li>
            Verifica que el backend esté corriendo en{" "}
            <code>localhost:8080</code>
          </li>
          <li>Verifica que "Backend conectado" aparezca arriba</li>
          <li>Regístrate con un usuario nuevo</li>
          <li>Haz login con ese usuario</li>
          <li>Conecta el WebSocket</li>
          <li>Crea un lobby de prueba</li>
          <li>Si todo funciona, ¡estás listo para continuar! 🚀</li>
        </ol>
      </div>
    </div>
  );
}

export default TestPage;
