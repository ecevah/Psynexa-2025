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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const websocket = new WebSocket(
      `ws://localhost:8000/audio-ws/${localStorage.getItem("userId")}`
    );

    websocket.onopen = () => {
      console.log("WebSocket Connected");
    };

    websocket.onmessage = (event) => {
      if (event.data.startsWith("data:audio")) {
        setMessages((prev) => [...prev, { type: "audio", data: event.data }]);
      } else {
        try {
          const jsonMessage = JSON.parse(event.data);
          setMessages((prev) => [
            ...prev,
            { type: "text", data: jsonMessage.message },
          ]);
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

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
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-3 rounded-lg bg-white">
            {msg.type === "audio" ? (
              <audio src={msg.data} controls className="w-full" />
            ) : (
              <p>{msg.data}</p>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-6 py-3 rounded-full ${
            isRecording ? "bg-red-500" : "bg-blue-500"
          } text-white hover:opacity-90`}
        >
          {isRecording ? "Kaydı Durdur" : "Kayda Başla"}
        </button>
      </div>
    </div>
  );
}
