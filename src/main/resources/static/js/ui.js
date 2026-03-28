/**
 * MusiChaos - UI Module
 * Helpers para la interfaz de usuario
 */

const UI = {
    /**
     * Muestra un mensaje de alerta
     */
    showMessage(message, type = 'error') {
        DOMElements.authMessage.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => {
            DOMElements.authMessage.innerHTML = '';
        }, CONFIG.MESSAGE_TIMEOUT);
    },

    /**
     * Muestra la sección de lobby (oculta auth)
     */
    showLobbySection() {
        DOMElements.authSection.classList.add('hidden');
        DOMElements.lobbySection.classList.remove('hidden');
    },

    /**
     * Muestra información del lobby
     */
    displayLobbyInfo(lobby) {
        DOMElements.currentLobbyCard.classList.remove('hidden');

        const playersHtml = lobby.players && lobby.players.length > 0
            ? `<ul class="player-list">${lobby.players.map(p => `<li>${p.username || p.email}</li>`).join('')}</ul>`
            : '<p>No hay jugadores aún</p>';

        const statusBadge = lobby.started
            ? '<span class="badge badge-success">En partida</span>'
            : '<span class="badge badge-warning">En espera</span>';

        DOMElements.lobbyInfo.innerHTML = `
            <p><strong>ID:</strong> ${lobby.id}</p>
            <p><strong>Código:</strong> ${lobby.code}</p>
            <p><strong>Nombre:</strong> ${lobby.name}</p>
            <p><strong>Estado:</strong> ${statusBadge}</p>
            <p><strong>Jugadores (${lobby.players ? lobby.players.length : 0}):</strong></p>
            ${playersHtml}
        `;
    },

    /**
     * Muestra la tabla de puntajes
     */
    displayScores(scores) {
        DOMElements.scoresCard.classList.remove('hidden');

        if (scores.length === 0) {
            DOMElements.scoresBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No hay puntajes aún</td></tr>';
            return;
        }

        DOMElements.scoresBody.innerHTML = scores.map((score, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${score.username}</td>
                <td><strong>${score.points}</strong></td>
            </tr>
        `).join('');
    },

    /**
     * Añade un mensaje al log
     */
    addLogMessage(message) {
        const p = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString();
        p.textContent = `[${timestamp}] ${message}`;
        DOMElements.messageLog.appendChild(p);
        DOMElements.messageLog.scrollTop = DOMElements.messageLog.scrollHeight;
    },

    /**
     * Actualiza el estado de WebSocket
     */
    updateWsStatus(connected) {
        if (connected) {
            DOMElements.wsStatus.textContent = '● Conectado';
            DOMElements.wsStatus.className = 'ws-status ws-connected';
        } else {
            DOMElements.wsStatus.textContent = '● Desconectado';
            DOMElements.wsStatus.className = 'ws-status ws-disconnected';
        }
    },

    /**
     * Muestra feedback de respuesta
     */
    showAnswerFeedback(message, type) {
        DOMElements.answerFeedback.innerHTML = `<div class="answer-feedback answer-${type}">${message}</div>`;
    },

    /**
     * Muestra información de la ronda actual (host)
     */
    displayCurrentRound(round) {
        const statusClass = round.status === 'WAITING' ? 'status-waiting' :
                           round.status === 'FINISHED' ? 'status-finished' : 'status-active';

        DOMElements.currentRoundInfo.innerHTML = `
            <p><strong>Ronda #${round.roundNumber}</strong>
               <span class="round-status ${statusClass}">${round.status}</span>
            </p>
            <p style="color: rgba(255,255,255,0.8);">ID: ${round.id}</p>
            <p style="color: rgba(255,255,255,0.8);">Respuesta: ${round.correctAnswer}</p>
        `;
    },

    /**
     * Muestra las respuestas de los jugadores
     */
    displayAnswers(answers) {
        if (answers.length === 0) {
            DOMElements.answersList.innerHTML = '<p style="color: rgba(255,255,255,0.7);">Aún no hay respuestas</p>';
            return;
        }

        DOMElements.answersList.innerHTML = answers.map(answer => {
            const correctClass = answer.correct ? 'correct' : 'incorrect';
            const icon = answer.correct ? '✅' : '❌';

            return `
                <div class="answer-item ${correctClass}">
                    <span><strong>${answer.username}</strong>: ${answer.answer}</span>
                    <span>${icon}</span>
                </div>
            `;
        }).join('');

        UI.addLogMessage(`📊 ${answers.length} respuestas recibidas`);
    }
};