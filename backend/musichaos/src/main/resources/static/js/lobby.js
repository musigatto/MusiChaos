/**
 * MusiChaos - Lobby Module
 * Gestión de lobbies y puntajes
 */

const Lobby = {
    /**
     * Inicializa los event listeners del lobby
     */
    init() {
        DOMElements.createLobbyBtn.addEventListener('click', () => this.create());
        DOMElements.joinLobbyBtn.addEventListener('click', () => this.join());
        DOMElements.loadScoresBtn.addEventListener('click', () => this.loadScores());
        DOMElements.leaveLobbyBtn.addEventListener('click', () => this.leave());
    },

    /**
     * Crea un nuevo lobby
     */
    async create() {
        try {
            const result = await API.createLobby();

            if (result.ok) {
                AppState.currentLobby = result.data;
                UI.displayLobbyInfo(result.data);
                WebSocketManager.subscribeToLobby(result.data.id);
                UI.addLogMessage(`✅ Lobby creado: ${result.data.code}`);

                // Verificar si somos el host
                this.checkIfHost();
            } else {
                alert('Error creando lobby: ' + result.ok);
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    /**
     * Se une a un lobby existente
     */
    async join() {
        const code = DOMElements.joinCode.value.trim();

        if (!code) {
            alert('Introduce un código válido');
            return;
        }

        try {
            const result = await API.joinLobby(code);

            if (result.ok) {
                AppState.currentLobby = result.data;
                UI.displayLobbyInfo(result.data);
                WebSocketManager.subscribeToLobby(result.data.id);
                UI.addLogMessage(`✅ Te uniste al lobby: ${result.data.code}`);

                // Verificar si somos el host
                this.checkIfHost();
            } else {
                alert('Lobby no encontrado');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    /**
     * Carga los puntajes del lobby
     */
    async loadScores() {
        if (!AppState.currentLobby) {
            alert('No estás en ningún lobby');
            return;
        }

        try {
            const result = await API.getScores(AppState.currentLobby.id);

            if (result.ok) {
                UI.displayScores(result.data);
                UI.addLogMessage(`📊 Puntajes cargados (${result.data.length} jugadores)`);
            } else {
                alert('Error cargando puntajes');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    /**
     * Carga puntajes automáticamente (sin mensaje)
     */
    loadScoresAuto() {
        if (AppState.currentLobby) {
            DOMElements.loadScoresBtn.click();
        }
    },

    /**
     * Sale del lobby
     */
    leave() {
        AppState.currentLobby = null;
        AppState.isHost = false;

        DOMElements.currentLobbyCard.classList.add('hidden');
        DOMElements.scoresCard.classList.add('hidden');
        DOMElements.hostPanel.classList.add('hidden');
        DOMElements.playerPanel.classList.add('hidden');
        DOMElements.answersPanel.classList.add('hidden');

        UI.addLogMessage('👋 Saliste del lobby');
    },

    /**
     * Verifica si el usuario actual es el host
     */
    checkIfHost() {
        if (AppState.currentLobby && AppState.currentLobby.players && AppState.currentLobby.players.length > 0) {
            // El primer jugador es el host
            const firstPlayer = AppState.currentLobby.players[0];
            AppState.isHost = firstPlayer.email === AppState.userEmail;

            if (AppState.isHost) {
                DOMElements.hostPanel.classList.remove('hidden');
                UI.addLogMessage('👑 Eres el HOST del lobby');
            } else {
                UI.addLogMessage('👤 Eres un jugador del lobby');
            }
        }
    }
};