import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  /**
   * Conecta al servidor WebSocket
   */
  connect(onConnect, onError) {
    this.client = new Client({
      webSocketFactory: () => new SockJS("/ws"),
      debug: (str) => {
        console.log("STOMP:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        console.log("✅ WebSocket connected");
        onConnect?.();
      },
      onStompError: (frame) => {
        this.connected = false;
        console.error("❌ WebSocket error:", frame);
        onError?.(frame);
      },
      onDisconnect: () => {
        this.connected = false;
        console.log("🔌 WebSocket disconnected");
      },
    });

    this.client.activate();
  }

  /**
   * Suscribirse a un topic
   */
  subscribe(destination, callback) {
    if (!this.client || !this.connected) {
      console.warn(
        "WebSocket not connected, cannot subscribe to:",
        destination,
      );
      return null;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    this.subscriptions.set(destination, subscription);
    console.log("📡 Subscribed to:", destination);
    return subscription;
  }

  /**
   * Desuscribirse de un topic
   */
  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log("🔕 Unsubscribed from:", destination);
    }
  }

  /**
   * Enviar mensaje
   */
  send(destination, body) {
    if (!this.client || !this.connected) {
      console.warn("WebSocket not connected, cannot send to:", destination);
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  /**
   * Desconectar
   */
  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.subscriptions.clear();
      this.connected = false;
      console.log("👋 WebSocket disconnected");
    }
  }

  /**
   * Verifica si está conectado
   */
  isConnected() {
    return this.connected;
  }
}

// Exportar instancia singleton
export const wsService = new WebSocketService();
