/**
 * MusiChaos - Game Module
 * Lógica del juego (host y jugadores)
 */

const Game = {
    /**
     * Inicializa los event listeners del juego
     */
    init() {
        // Host controls
        DOMElements.createRoundBtn.addEventListener('click', () => this.createRound());
        DOMElements.finishRoundBtn.addEventListener('click', () => this.finishRound());

        // Player controls
        DOMElements.submitAnswerBtn.addEventListener('click', () => this.submitAnswer());

        // Answers
        DOMElements.refreshAnswersBtn.addEventListener('click', () => {
            if (AppState.currentRound) {
                this.loadAnswers(AppState.currentRound.id);
            }
        });
    },

    /**
     * Crea una nueva ronda (HOST)
     */
    async createRound() {
        if (!AppState.currentLobby) {
            alert('No estás en un lobby');
            return;
        }

        const roundNumber = DOMElements.hostRoundNumber.value;
        const correctAnswer = DOMElements.hostCorrectAnswer.value.trim();

        if (!correctAnswer) {
            alert('Debes especificar la respuesta correcta');
            return;
        }

        try {
            const result = await API.createRound(AppState.currentLobby.id, roundNumber, correctAnswer);

            if (result.ok) {
                AppState.currentRound = result.data;
                UI.displayCurrentRound(result.data);
                UI.addLogMessage(`🎯 Ronda ${roundNumber} creada`);

                // Incrementar número de ronda para la próxima
                DOMElements.hostRoundNumber.value = parseInt(roundNumber) + 1;
                DOMElements.hostCorrectAnswer.value = '';

                // Habilitar botón de finalizar
                DOMElements.finishRoundBtn.disabled = false;

                // Mostrar panel de respuestas
                DOMElements.answersPanel.classList.remove('hidden');
            } else {
                alert('Error creando ronda');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    /**
     * Finaliza la ronda actual (HOST)
     */
    async finishRound() {
        if (!AppState.currentRound) {
            alert('No hay ronda activa');
            return;
        }

        try {
            const result = await API.finishRound(AppState.currentRound.id);

            if (result.ok) {
                UI.addLogMessage(`✅ Ronda ${result.data.roundNumber} finalizada`);

                // Resetear estado
                AppState.currentRound = null;
                DOMElements.finishRoundBtn.disabled = true;
                DOMElements.currentRoundInfo.innerHTML = '<p style="color: rgba(255,255,255,0.7);">Ronda finalizada</p>';

                // Cargar puntajes automáticamente
                Lobby.loadScoresAuto();
            } else {
                alert('Error finalizando ronda');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    /**
     * Envía una respuesta (JUGADOR)
     */
    async submitAnswer() {
        if (!AppState.currentRound) {
            alert('No hay ronda activa');
            return;
        }

        if (AppState.hasAnswered) {
            alert('Ya has enviado tu respuesta para esta ronda');
            return;
        }

        const answer = DOMElements.playerAnswer.value.trim();
        if (!answer) {
            alert('Escribe una respuesta');
            return;
        }

        try {
            // Obtener username del usuario actual
            const username = AppState.currentLobby.players.find(p => p.email === AppState.userEmail)?.username || AppState.userEmail;

            const result = await API.submitAnswer(AppState.currentRound.id, username, answer);

            if (result.ok) {
                AppState.hasAnswered = true;
                DOMElements.submitAnswerBtn.disabled = true;
                DOMElements.playerAnswer.disabled = true;

                UI.showAnswerFeedback('⏳ Respuesta enviada. Esperando resultados...', 'waiting');
                UI.addLogMessage(`📤 Respuesta enviada: "${answer}"`);

                // Cargar respuestas para ver el resultado
                setTimeout(() => this.loadAnswers(AppState.currentRound.id), CONFIG.AUTO_REFRESH_ANSWERS_DELAY);
            } else {
                alert('Error enviando respuesta');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    },

    /**
     * Carga las respuestas de una ronda
     */
    async loadAnswers(roundId) {
        try {
            const result = await API.getAnswers(roundId);

            if (result.ok) {
                UI.displayAnswers(result.data);

                // Si el jugador tiene respuesta, mostrar feedback
                if (!AppState.isHost && AppState.userEmail) {
                    const username = AppState.currentLobby.players.find(p => p.email === AppState.userEmail)?.username || AppState.userEmail;
                    const myAnswer = result.data.find(a => a.username === username);

                    if (myAnswer) {
                        if (myAnswer.correct) {
                            UI.showAnswerFeedback('✅ ¡Correcto! +10 puntos', 'correct');
                        } else {
                            UI.showAnswerFeedback(`❌ Incorrecto. La respuesta era: ${AppState.currentRound.correctAnswer}`, 'incorrect');
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error cargando respuestas:', err);
        }
    }
};