import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const {
    login,
    register,
    isAuthenticated,
    loading,
    error: authError,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/game");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Guardar email para uso posterior
      localStorage.setItem("user_email", formData.email);
      setMessage("✅ Login exitoso! Redirigiendo...");
      setMessageType("success");
      setTimeout(() => navigate("/game"), 1000);
    } else {
      setMessage(result.error);
      setMessageType("error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.username) {
      setMessage("Username es requerido");
      setMessageType("error");
      return;
    }

    const result = await register(
      formData.email,
      formData.username,
      formData.password,
    );

    if (result.success) {
      setMessage("✅ Registro exitoso! Ahora inicia sesión.");
      setMessageType("success");
      setTimeout(() => {
        setActiveTab("login");
        setFormData({ ...formData, username: "" });
      }, 2000);
    } else {
      setMessage(result.error);
      setMessageType("error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎵 MusiChaos</h1>
          <p>Music Quiz Game</p>
        </div>

        {message && (
          <div className={`alert alert-${messageType}`}>{message}</div>
        )}

        <div className="auth-tabs">
          <button
            className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Iniciar Sesión
          </button>
          <button
            className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Registrarse
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Tu nombre de usuario"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
