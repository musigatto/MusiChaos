/**
 * MusiChaos - Auth Module
 * Gestión de autenticación (login y registro)
 */

const Auth = {
    /**
     * Inicializa los event listeners de autenticación
     */
    init() {
        DOMElements.registerBtn.addEventListener('click', () => this.register());
        DOMElements.loginBtn.addEventListener('click', () => this.login());
        DOMElements.logoutBtn.addEventListener('click', () => this.logout());
    },

    /**
     * Registra un nuevo usuario
     */
    async register() {
        const email = DOMElements.authEmail.value;
        const username = DOMElements.authUsername.value;
        const password = DOMElements.authPassword.value;

        try {
            const result = await API.register(email, username, password);

            if (result.ok) {
                UI.showMessage('Registro exitoso. Ahora inicia sesión.', 'success');
            } else {
                UI.showMessage(result.data, 'error');
            }
        } catch (err) {
            UI.showMessage('Error de conexión: ' + err.message, 'error');
        }
    },

    /**
     * Inicia sesión
     */
    async login() {
        const email = DOMElements.authEmail.value;
        const password = DOMElements.authPassword.value;

        // Guardar email para uso posterior
        AppState.userEmail = email;

        try {
            const result = await API.login(email, password);

            if (result.ok) {
                AppState.token = result.data.token;
                localStorage.setItem('jwt_token', AppState.token);

                UI.showMessage('Login exitoso!', 'success');

                setTimeout(() => {
                    UI.showLobbySection();
                    WebSocketManager.connect();
                }, 1000);
            } else {
                UI.showMessage('Credenciales inválidas', 'error');
            }
        } catch (err) {
            UI.showMessage('Error de conexión: ' + err.message, 'error');
        }
    },

    /**
     * Cierra sesión
     */
    logout() {
        localStorage.removeItem('jwt_token');
        AppState.token = null;
        AppState.currentLobby = null;

        if (AppState.stompClient) {
            AppState.stompClient.disconnect();
        }

        location.reload();
    }
};