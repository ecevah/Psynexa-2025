from fastapi import FastAPI, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from . import models, auth
from .database import engine, SessionLocal
from .routers import auth as auth_router, messages
import json
import base64
from app.file_sending import speech_to_text_gemini_generation_tts, multimodal_process_gemini_pro
import tempfile
import os
from starlette.websockets import WebSocketDisconnect
import uuid
from sqlalchemy.orm import Session

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router, prefix="/auth", tags=["authentication"])
app.include_router(messages.router, prefix="/api", tags=["messages"])

# WebSocket connections storage
class ConnectionManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    def get_connection(self, client_id: str):
        return self.active_connections.get(client_id)

manager = ConnectionManager()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def save_message(db: Session, client_id: str, message_type: str, content: str, extra_data: dict = None):
    db_message = models.Message(
        client_id=client_id,
        message_type=message_type,
        content=content,
        extra_data=extra_data or {}
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.websocket("/audio-ws/{client_id}")
async def audio_websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    db = SessionLocal()
    
    try:
        while True:
            audio_data = await websocket.receive_text()
            
            if audio_data and audio_data.startswith('data:audio'):
                base64_audio = audio_data.split(',')[1]
                binary_audio = base64.b64decode(base64_audio)
                
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                    temp_file.write(binary_audio)
                    temp_file_path = temp_file.name
                
                try:
                    with open(temp_file_path, 'rb') as audio_file:
                        processed_audio = speech_to_text_gemini_generation_tts(
                            audio_file=audio_file,
                            client_id=client_id
                        )
                        if hasattr(processed_audio, '__iter__'):
                            processed_audio = b''.join(processed_audio)
                    
                    processed_base64 = base64.b64encode(processed_audio).decode('utf-8')
                    response_data = f"data:audio/mp3;base64,{processed_base64}"
                    await websocket.send_text(response_data)
                    
                except Exception as e:
                    error_response = json.dumps({"error": str(e)})
                    await websocket.send_text(error_response)
                
                finally:
                    if os.path.exists(temp_file_path):
                        os.remove(temp_file_path)
    
    except WebSocketDisconnect:
        manager.disconnect(client_id)
    finally:
        db.close()

@app.websocket("/media-ws/{client_id}")
async def media_websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    db = SessionLocal()
    audio_path = None
    image_path = None
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if not all(key in data for key in ['audio', 'image']):
                await websocket.send_json({
                    'status': 'error',
                    'error': 'Missing audio or image data'
                })
                continue

            audio_binary = base64.b64decode(data['audio'])
            image_binary = base64.b64decode(data['image'])
            
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as audio_temp:
                audio_temp.write(audio_binary)
                audio_path = audio_temp.name
            
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as image_temp:
                image_temp.write(image_binary)
                image_path = image_temp.name
            
            try:
                with open(audio_path, 'rb') as audio_file:
                    processed_audio = multimodal_process_gemini_pro(
                        audio_file=audio_file,
                        image_url=image_path,
                        client_id=client_id,
                        language='tr'
                    )
                
                if hasattr(processed_audio, '__iter__'):
                    processed_audio = b''.join(processed_audio)
                
                if processed_audio:
                    processed_base64 = base64.b64encode(processed_audio).decode('utf-8')
                    response_data = f"data:audio/mp3;base64,{processed_base64}"
                    await websocket.send_text(response_data)
                else:
                    raise Exception("No audio data was generated")

            except Exception as e:
                error_msg = str(e)
                await websocket.send_json({
                    'status': 'error',
                    'error': error_msg
                })

            finally:
                # Clean up temporary files
                if audio_path and os.path.exists(audio_path):
                    os.remove(audio_path)
                if image_path and os.path.exists(image_path):
                    os.remove(image_path)

    except WebSocketDisconnect:
        manager.disconnect(client_id)
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI backend"} 