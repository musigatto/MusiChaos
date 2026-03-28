/**
 * MusiChaos - API Module
 * Todas las llamadas a la API REST
 */

const API = {
    /**
     * Auth Endpoints
     */
    async register(email, username, password) {
        const response = await fetch(`${CONFIG.API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });
        return { ok: response.ok, data: await response.text() };
    },

    async login(email, password) {
        const response = await fetch(`${CONFIG.API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return { ok: response.ok, data: await response.json() };
    },

    /**
     * Lobby Endpoints
     */
    async createLobby() {
        const response = await fetch(`${CONFIG.API_BASE}/api/lobby/create`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${AppState.token}` }
        });
        return { ok: response.ok, data: await response.json() };
    },

    async joinLobby(code) {
        const response = await fetch(`${CONFIG.API_BASE}/api/lobby/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.token}`
            },
            body: JSON.stringify({ code })
        });
        return { ok: response.ok, data: await response.json() };
    },

    async getScores(lobbyId) {
        const response = await fetch(`${CONFIG.API_BASE}/api/lobby/${lobbyId}/scores`, {
            headers: { 'Authorization': `Bearer ${AppState.token}` }
        });
        return { ok: response.ok, data: await response.json() };
    },

    /**
     * Round Endpoints
     */
    async createRound(lobbyId, roundNumber, correctAnswer) {
        const response = await fetch(
            `${CONFIG.API_BASE}/api/rounds?lobbyId=${lobbyId}&roundNumber=${roundNumber}&correctAnswer=${encodeURIComponent(correctAnswer)}`,
            {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${AppState.token}` }
            }
        );
        return { ok: response.ok, data: await response.json() };
    },

    async submitAnswer(roundId, username, answer) {
        const response = await fetch(
            `${CONFIG.API_BASE}/api/rounds/${roundId}/answer?username=${encodeURIComponent(username)}&answer=${encodeURIComponent(answer)}`,
            {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${AppState.token}` }
            }
        );
        return { ok: response.ok, data: await response.json() };
    },

    async finishRound(roundId) {
        const response = await fetch(`${CONFIG.API_BASE}/api/rounds/${roundId}/finish`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${AppState.token}` }
        });
        return { ok: response.ok, data: await response.json() };
    },

    async getAnswers(roundId) {
        const response = await fetch(`${CONFIG.API_BASE}/api/rounds/${roundId}/answers`, {
            headers: { 'Authorization': `Bearer ${AppState.token}` }
        });
        return { ok: response.ok, data: await response.json() };
    }
};