import { useEffect, useRef, useState } from "react";

const MAX_RECONNECT_DELAY_MS = 30000;

// Raw `chat.message` broadcast payload — same shape the REST chat-history endpoints return
// (see `RawApiChatMessage` in lib/services/liveMusic.ts / radio.ts), normalized by each
// consumer's own `mapChatMessage`.
export interface LiveRoomMessage {
  id?: string | number;
  username?: string;
  avatar_url?: string;
  message?: string;
  created_at?: string;
}

export function useLiveRoom(roomType: string, roomId: string, token?: string) {
  const [onlineCount, setOnlineCount] = useState(0);
  const [messages, setMessages] = useState<LiveRoomMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const base = process.env.NEXT_PUBLIC_WS_BASE_URL || 'wss://art-du-kivu-api.kelor.tech';
    // Remove wss:// if it is https or ws:// if http
    const wsBase = base.replace(/^http/, 'ws');

    // NOTE: the auth token travels as a query param because the browser WebSocket API has no way
    // to attach an Authorization header to the handshake. The connection itself is encrypted
    // (wss://), but the token can still land in server/proxy access logs. Moving this to a
    // message-based (or Sec-WebSocket-Protocol-based) auth handshake requires backend support —
    // tracked as a follow-up, not something the frontend can change unilaterally.
    const url = new URL(`${wsBase}/ws/live/${roomType}/${roomId}/`);
    if (token) url.searchParams.set("token", token);

    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
    let reconnectDelay = 1000;
    let cancelled = false;

    const connect = () => {
      const ws = new WebSocket(url.toString());
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectDelay = 1000; // reset backoff after a successful connection
      };

      heartbeat = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "heartbeat" }));
        }
      }, 15000);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "presence.count") setOnlineCount(data.count);
          if (data.event === "chat.message") setMessages((prev) => [...prev, data.message]);
        } catch (e) {
          console.error("Error parsing websocket message", e);
        }
      };

      ws.onclose = () => {
        if (heartbeat) clearInterval(heartbeat);
        if (cancelled) return;
        // Reconnect with exponential backoff instead of leaving the chat silently dead.
        reconnectTimeout = setTimeout(() => {
          reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY_MS);
          connect();
        }, reconnectDelay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (heartbeat) clearInterval(heartbeat);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, [roomType, roomId, token]);

  return { onlineCount, messages, setMessages };
}
