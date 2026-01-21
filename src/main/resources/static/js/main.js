/**
 * MusiChaos - Main Application
 * Punto de entrada e inicialización de la aplicación
 */

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    initializeApp();
});

/**
 * Inicializa todas las referencias a elementos del DOM
 */
function initializeDOMElements() {
    // Auth
    DOMElements.authSection = document.getElementById('authSection');
    DOMElements.authMessage = document.getElementById('authMessage');
    DOMElements.authEmail = document.getElementById('authEmail');
    DOMElements.authUsername = document.getElementById('authUsername');
    DOMElements.authPassword = document.getElementById('authPassword');
    DOMElements.registerBtn = document.getElementById('registerBtn');
    DOMElements.loginBtn = document.getElementById('loginBtn');
    DOMElements.logoutBtn = document.getElementById('logoutBtn');

    // Lobby
    DOMElements.lobbySection = document.getElementById('lobbySection');
    DOMElements.createLobbyBtn = document.getElementById('createLobbyBtn');
    DOMElements.joinCode = document.getElementById('joinCode');
    DOMElements.joinLobbyBtn = document.getElementById('joinLobbyBtn');
    DOMElements.currentLobbyCard = document.getElementById('currentLobbyCard');
    DOMElements.lobbyInfo = document.getElementById('lobbyInfo');
    DOMElements.loadScoresBtn = document.getElementById('loadScoresBtn');
    DOMElements.leaveLobbyBtn = document.getElementById('leaveLobbyBtn');

    // Game - Host
    DOMElements.hostPanel = document.getElementById('hostPanel');
    DOMElements.hostRoundNumber = document.getElementById('hostRoundNumber');
    DOMElements.hostCorrectAnswer = document.getElementById('hostCorrectAnswer');
    DOMElements.createRoundBtn = document.getElementById('createRoundBtn');
    DOMElements.currentRoundInfo = document.getElementById('currentRoundInfo');
    DOMElements.finishRoundBtn = document.getElementById('finishRoundBtn');

    // Game - Player
    DOMElements.playerPanel = document.getElementById('playerPanel');
    DOMElements.playerRoundTitle = document.getElementById('playerRoundTitle');
    DOMElements.playerRoundStatus = document.getElementById('playerRoundStatus');
    DOMElements.playerAnswer = document.getElementById('playerAnswer');
    DOMElements.submitAnswerBtn = document.getElementById('submitAnswerBtn');
    DOMElements.answerFeedback = document.getElementById('answerFeedback');

    // Answers
    DOMElements.answersPanel = document.getElementById('answersPanel');
    DOMElements.answersList = document.getElementById('answersList');
    DOMElements.refreshAnswersBtn = document.getElementById('refreshAnswersBtn');

    // Scores
    DOMElements.scoresCard = document.getElementById('scoresCard');
    DOMElements.scoresBody = document.getElementById('scoresBody');

    // WebSocket
    DOMElements.wsStatus = document.getElementById('wsStatus');
    DOMElements.messageLog = document.getElementById('messageLog');
}

/**
 * Inicializa la aplicación
 */
function initializeApp() {
    // Inicializar módulos
    Auth.init();
    Lobby.init();
    Game.init();

    // Si hay token guardado, auto-login
    if (AppState.token) {
        UI.showLobbySection();
        WebSocketManager.connect();
    }

    console.log('🎵 MusiChaos iniciado correctamente');
}