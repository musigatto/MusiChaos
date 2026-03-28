/**
 * MusiChaos - Configuration
 * Configuración global de la aplicación
 */

const CONFIG = {
    // API Configuration
    API_BASE: window.location.origin,

    // WebSocket Configuration
    WS_URL: `${window.location.origin}/ws`,

    // Game Configuration
    POINTS_PER_CORRECT_ANSWER: 10,

    // UI Configuration
    MESSAGE_TIMEOUT: 5000,
    AUTO_REFRESH_ANSWERS_DELAY: 1000
};

// Estado global de la aplicación
const AppState = {
    // Auth
    token: localStorage.getItem('jwt_token'),
    userEmail: null,

    // Lobby
    currentLobby: null,
    isHost: false,

    // Game
    currentRound: null,
    hasAnswered: false,

    // WebSocket
    stompClient: null,
    wsConnected: false
};

// Elementos del DOM (se inicializarán en main.js)
const DOMElements = {
    // Auth
    authSection: null,
    authMessage: null,
    authEmail: null,
    authUsername: null,
    authPassword: null,
    registerBtn: null,
    loginBtn: null,
    logoutBtn: null,

    // Lobby
    lobbySection: null,
    createLobbyBtn: null,
    joinCode: null,
    joinLobbyBtn: null,
    currentLobbyCard: null,
    lobbyInfo: null,
    loadScoresBtn: null,
    leaveLobbyBtn: null,

    // Game - Host
    hostPanel: null,
    hostRoundNumber: null,
    hostCorrectAnswer: null,
    createRoundBtn: null,
    currentRoundInfo: null,
    finishRoundBtn: null,

    // Game - Player
    playerPanel: null,
    playerRoundTitle: null,
    playerRoundStatus: null,
    playerAnswer: null,
    submitAnswerBtn: null,
    answerFeedback: null,

    // Answers
    answersPanel: null,
    answersList: null,
    refreshAnswersBtn: null,

    // Scores
    scoresCard: null,
    scoresBody: null,

    // WebSocket
    wsStatus: null,
    messageLog: null
};