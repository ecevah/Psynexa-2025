"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VoiceChatPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const clientId = useRef("client_" + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // WebSocket bağlantısı
    const websocket = new WebSocket(`ws://localhost:8000/audio-ws/${1}`);

    websocket.onopen = () => {
      addMessageToLog("WebSocket Connected", "incoming");
    };

    websocket.onmessage = async (event) => {
      try {
        const data = event.data;
        if (data.startsWith("data:audio")) {
          addMessageToLog("Received processed audio", "incoming");
          setMessages((prev) => [...prev, { type: "audio", data: data }]);
          // Otomatik ses çalma
          const audio = new Audio(data);
          await audio.play();
        } else {
          const jsonResponse = JSON.parse(data);
          if (jsonResponse.error) {
            addMessageToLog(`Error: ${jsonResponse.error}`, "incoming");
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
        addMessageToLog(
          `Error processing message: ${error.message}`,
          "incoming"
        );
      }
    };

    websocket.onclose = () => {
      addMessageToLog("WebSocket connection closed", "incoming");
    };

    websocket.onerror = (error) => {
      addMessageToLog(`WebSocket error: ${error.message}`, "incoming");
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const addMessageToLog = (message, direction) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        data: `${direction === "incoming" ? "Received" : "Sent"}: ${message}`,
        direction: direction,
      },
    ]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(reader.result);
            addMessageToLog("Audio data sent", "outgoing");
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      addMessageToLog("Recording started", "outgoing");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      addMessageToLog(
        `Error accessing microphone: ${error.message}`,
        "incoming"
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      addMessageToLog("Recording stopped", "outgoing");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Audio WebSocket Test</h2>

      {/* Message Log */}
      <div className="w-full h-[200px] border border-gray-300 overflow-y-auto mb-5 p-2.5 font-mono">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-1 p-1.5 rounded text-black ${
              msg.type === "text"
                ? msg.direction === "incoming"
                  ? "bg-blue-50"
                  : "bg-gray-100"
                : "bg-white"
            }`}
          >
            {msg.type === "audio" ? (
              <audio src={msg.data} controls className="w-full" />
            ) : (
              <p className="text-black">{msg.data}</p>
            )}
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="space-x-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Stop Recording
        </button>
      </div>
    </div>
  );
}
