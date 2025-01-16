import { useEffect, useRef, useState } from "react";

export function useWebSocket(url, token) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!url || !token) return;

    // Add token to URL as query parameter
    const wsUrl = new URL(url);
    wsUrl.searchParams.append("token", token);

    const ws = new WebSocket(wsUrl.toString());
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url, token]);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
