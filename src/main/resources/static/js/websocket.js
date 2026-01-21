/**
 * MusiChaos - WebSocket Module
 * Gestión de conexión WebSocket y eventos en tiempo real
 */

const WebSocketManager = {
    /**
     * Conecta al servidor WebSocket
     */
    connect() {
        const socket = new SockJS(CONFIG.WS_URL);
        AppState.stompClient = Stomp.over(socket);

        AppState.stompClient.connect({}, (frame) => {
            AppState.wsConnected = true;
            UI.updateWsStatus(true);
            UI.addLogMessage('🟢 WebSocket conectado');

            // Suscribirse a actualizaciones generales
            AppState.stompClient.subscribe('/topic/lobby', (message) => {
                const data = JSON.parse(message.body);
                UI.addLogMessage(`📨 Mensaje recibido: ${JSON.stringify(data)}`);

                // Si es información de un lobby, actualizarla
                if (data.id && AppState.currentLobby && data.id === AppState.currentLobby.id) {
                    AppState.currentLobby = data;
                    UI.displayLobbyInfo(data);
                }
            });
        }, (error) => {
            AppState.wsConnected = false;
            UI.updateWsStatus(false);
            UI.addLogMessage('🔴 Error WebSocket: ' + error);
        });
    },

    /**
     * Se suscribe a un lobby específico
     */
    subscribeToLobby(lobbyId) {
        if (AppState.stompClient && AppState.wsConnected) {
            AppState.stompClient.subscribe(`/topic/lobby/${lobbyId}`, (message) => {
                const data = JSON.parse(message.body);
                UI.addLogMessage(`📬 Lobby ${lobbyId}: ${data.type || 'update'}`);

                // Manejar diferentes tipos de mensajes
                this.handleLobbyMessage(data);
            });
        }
    },

    /**
     * Maneja mensajes del lobby
     */
    handleLobbyMessage(data) {
        switch (data.type) {
            case 'NEW_ROUND':
                this.handleNewRound(data);
                break;
            case 'ANSWER':
                this.handleNewAnswer(data);
                break;
            case 'ROUND_FINISHED':
                this.handleRoundFinished(data);
                break;
        }
    },

    /**
     * Maneja el evento de nueva ronda
     */
    handleNewRound(data) {
        UI.addLogMessage('🎯 Nueva ronda iniciada');

        if (!AppState.isHost) {
            // Mostrar panel de juego para jugadores
            DOMElements.playerPanel.classList.remove('hidden');
            DOMElements.answersPanel.classList.remove('hidden');

            // Resetear estado del jugador
            AppState.hasAnswered = false;
            DOMElements.playerAnswer.value = '';
            DOMElements.playerAnswer.disabled = false;
            DOMElements.submitAnswerBtn.disabled = false;
            DOMElements.answerFeedback.innerHTML = '';

            DOMElements.playerRoundTitle.textContent = `Ronda #${data.roundNumber || '?'}`;
            DOMElements.playerRoundStatus.textContent = '¡Escribe tu respuesta!';
        }
    },

    /**
     * Maneja el evento de nueva respuesta
     */
    handleNewAnswer(data) {
        UI.addLogMessage(`💬 ${data.username} ha respondido`);

        // Recargar respuestas si hay una ronda activa
        if (AppState.currentRound) {
            Game.loadAnswers(AppState.currentRound.id);
        }
    },

    /**
     * Maneja el evento de ronda finalizada
     */
    handleRoundFinished(data) {
        UI.addLogMessage(`✅ Ronda finalizada`);

        if (!AppState.isHost) {
            DOMElements.playerRoundStatus.textContent = 'Ronda finalizada';
            DOMElements.submitAnswerBtn.disabled = true;
        }

        // Cargar puntajes actualizados
        Lobby.loadScoresAuto();
    }
};