import { useState, useEffect, useCallback } from "react";

export const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket Connected");
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket Disconnected");
      // Yeniden bağlanma mantığı
      setTimeout(() => {
        setSocket(new WebSocket(url));
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      let message;
      try {
        message = JSON.parse(event.data);
      } catch {
        message = event.data;
      }
      setMessages((prev) => [...prev, message]);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback(
    (message) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          typeof message === "string" ? message : JSON.stringify(message)
        );
      } else {
        console.error("WebSocket is not connected");
      }
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    messages,
    sendMessage,
  };
};
