import { useEffect, useRef, useState } from "react";

export function useLiveRoom(roomType: string, roomId: string, token?: string) {
  const [onlineCount, setOnlineCount] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const base = process.env.NEXT_PUBLIC_WS_BASE_URL || 'wss://art-du-kivu-api.kelor.tech';
    // Remove wss:// if it is https or ws:// if http
    const wsBase = base.replace(/^http/, 'ws');
    
    const url = new URL(`${wsBase}/ws/live/${roomType}/${roomId}/`);
    if (token) url.searchParams.set("token", token);

    const ws = new WebSocket(url.toString());
    wsRef.current = ws;

    const heartbeat = setInterval(() => {
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

    return () => {
      clearInterval(heartbeat);
      ws.close();
    };
  }, [roomType, roomId, token]);

  return { onlineCount, messages, setMessages };
}
