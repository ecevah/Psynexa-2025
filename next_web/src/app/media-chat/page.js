"use client";

import { useState, useRef, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function MediaChat() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [imageBase64, setImageBase64] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);

  const clientId = useRef(`client_${Math.random().toString(36).substr(2, 9)}`);
  const { socket: audioSocket, isConnected: isAudioConnected } = useWebSocket(
    `ws://localhost:8000/audio-ws/${1}`,
    localStorage.getItem("token")
  );
  const { socket: mediaSocket, isConnected: isMediaConnected } = useWebSocket(
    `ws://localhost:8000/media-ws/${1}`,
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (audioSocket) {
      audioSocket.onmessage = async (event) => {
        try {
          const data = event.data;
          if (data.startsWith("data:audio")) {
            addMessage("Received processed audio", "incoming");
            const audio = new Audio(data);
            await audio.play();
          } else {
            const jsonResponse = JSON.parse(data);
            if (jsonResponse.error) {
              addMessage(`Error: ${jsonResponse.error}`, "incoming");
            } else {
              addMessage(
                `Server response: ${JSON.stringify(jsonResponse)}`,
                "incoming"
              );
            }
          }
        } catch (error) {
          console.error("Error processing message:", error);
          addMessage(`Error processing message: ${error.message}`, "incoming");
        }
      };
    }
  }, [audioSocket]);

  useEffect(() => {
    if (mediaSocket) {
      mediaSocket.onmessage = async (event) => {
        try {
          const data = event.data;
          if (data.startsWith("data:audio")) {
            addMessage("Received processed audio from media", "incoming");
            const audio = new Audio(data);
            await audio.play();
          } else {
            const jsonResponse = JSON.parse(data);
            if (jsonResponse.error) {
              addMessage(`Error: ${jsonResponse.error}`, "incoming");
            } else {
              addMessage(
                `Server response: ${JSON.stringify(jsonResponse)}`,
                "incoming"
              );
            }
          }
        } catch (error) {
          console.error("Error processing message:", error);
          addMessage(`Error processing message: ${error.message}`, "incoming");
        }
      };
    }
  }, [mediaSocket]);

  const addMessage = (text, direction) => {
    setMessages((prev) => [
      ...prev,
      { text, direction, timestamp: new Date() },
    ]);
  };

  const startCapture = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = audioStream;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        audioChunksRef.current = [];

        // Get audio as base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const audioBase64 = reader.result;

          // Send audio to audio websocket
          if (audioSocket && audioSocket.readyState === WebSocket.OPEN) {
            audioSocket.send(audioBase64);
            addMessage("Audio data sent", "outgoing");
          }

          // If we have an image, send both to media websocket
          if (
            imageBase64 &&
            mediaSocket &&
            mediaSocket.readyState === WebSocket.OPEN
          ) {
            const data = {
              audio: audioBase64.split(",")[1],
              image: imageBase64,
            };
            mediaSocket.send(JSON.stringify(data));
            addMessage("Media data sent", "outgoing");
          }
        };
      };

      mediaRecorder.start(1000); // Capture audio every second
      setIsCapturing(true);
      addMessage("Started audio capture", "outgoing");
    } catch (error) {
      addMessage(`Error starting capture: ${error.message}`, "incoming");
    }
  };

  const captureImage = async () => {
    try {
      // Only open camera when taking photo
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
      });

      videoRef.current.srcObject = videoStream;
      videoRef.current.style.display = "block";

      // Wait for video to be ready
      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          resolve();
        };
      });

      // Wait a bit for camera to adjust
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64Image = canvas.toDataURL("image/jpeg").split(",")[1];
        setImageBase64(base64Image);
        addMessage("Image captured", "outgoing");

        // Stop and hide video after capturing
        videoStream.getTracks().forEach((track) => track.stop());
        videoRef.current.style.display = "none";
      }
    } catch (error) {
      addMessage(`Error capturing image: ${error.message}`, "incoming");
    }
  };

  const stopCapture = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsCapturing(false);
      setImageBase64(null);
      addMessage("Stopped media capture", "outgoing");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Media Chat</h1>

      {/* Connection Status */}
      <div
        className={`mb-4 p-2 rounded text-black ${
          isAudioConnected && isMediaConnected ? "bg-green-100" : "bg-red-100"
        }`}
      >
        Connection Status:{" "}
        {isAudioConnected && isMediaConnected ? "Connected" : "Disconnected"}
      </div>

      {/* Message Log */}
      <div className="h-48 border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50 text-black">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded ${
              msg.direction === "incoming" ? "bg-blue-100" : "bg-gray-200"
            }`}
          >
            <span className="text-sm text-gray-500">
              {msg.timestamp.toLocaleTimeString()}
            </span>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Video Preview (Hidden by default, only shown when taking photo) */}
      <div className="mb-4">
        <video
          ref={videoRef}
          className="w-80 h-60 border rounded-lg bg-black"
          autoPlay
          muted
          style={{ display: "none" }}
        />
        <canvas ref={canvasRef} className="hidden" />
        {imageBase64 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-2">Captured Image:</p>
            <img
              src={`data:image/jpeg;base64,${imageBase64}`}
              alt="Captured"
              className="w-80 h-60 border rounded-lg object-cover"
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-x-4">
        <button
          onClick={isCapturing ? stopCapture : startCapture}
          className={`px-4 py-2 rounded-lg ${
            isCapturing
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {isCapturing ? "Stop Recording" : "Start Recording"}
        </button>
        {isCapturing && !imageBase64 && (
          <button
            onClick={captureImage}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
          >
            Take Photo
          </button>
        )}
      </div>
    </div>
  );
}
