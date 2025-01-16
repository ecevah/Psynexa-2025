"""
**Libraries**:
Pillow
groq
langchain-google-genai
elevenlabs
google-generativeai
"""

import os
from groq import Groq
from langchain_google_genai import ChatGoogleGenerativeAI
from elevenlabs.client import ElevenLabs
from PIL import Image
import google.generativeai as genai
from datetime import datetime
from pytz import timezone
from app.database import get_db
from sqlalchemy import text

# Set your API keys. These are crucial for authentication with external services.
os.environ['GOOGLE_API_KEY'] = "AIzaSyCIvZsOg8M5nzp2jy5U7JT722AmgaSI7VU"  # Replace with your Google API key
os.environ['GROQ_API_KEY'] = "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"  # Replace with your GROQ API key
eleven_api_key = "sk_8d2f8f9a0f1496ca19b647a810fd45e6a5815a757170b873"  # Replace with your ElevenLabs API key

gemini_client = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
elevenlabs_client = ElevenLabs(api_key=eleven_api_key)
voice_id = "9BWtsMINqrJLrRacOk9x"

def speech_to_text_gemini_generation_tts(audio_file, client_id: str, language: str = "tr"):
    """
    Transcribes an audio file to text, generates response, and saves to database.
    """
    # Get Istanbul timezone for UTC+3
    istanbul_tz = timezone('Europe/Istanbul')
    current_time = datetime.now(istanbul_tz)

    print("Basladi")
    print(current_time)
    print(client_id)
    print(language)
    print(audio_file)
    
    # Get database session
    db = next(get_db())
    
    try:
        # Step 1: Use Groq for transcription
        client = Groq()
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3-turbo",
            language=language,
            response_format="verbose_json",
        )
        transcribed_text = transcription.text

        # Step 2: Gemini Flash generation
        gemini_messages = [
            ("system", "You are a helpful assistant. Speak in english"),
            ("human", transcribed_text),
        ]
        gemini_response = gemini_client.invoke(gemini_messages)
        generated_text = gemini_response.content
        print("Gemini response")
        print(generated_text)

        # Save to database using SQLAlchemy text()
        query = text("""
            INSERT INTO messages (client_id, text, response, timestamp, type, status, created_at, updated_at)
            VALUES (:client_id, :text, :response, :timestamp, 'audio', 'pending', :created_at, :updated_at)
        """)
        
        db.execute(query, {
            'client_id': client_id,
            'text': transcribed_text,
            'response': generated_text,
            'timestamp': current_time,
            'created_at': current_time,
            'updated_at': current_time
        })
        db.commit()

        # Step 3: Text-to-speech
        global voice_id
        audio_data = elevenlabs_client.generate(
            text=generated_text,
            voice=voice_id,
            model="eleven_multilingual_v2"
        )

        # Update status to delivered
        update_query = text("""
            UPDATE messages 
            SET status = 'delivered'
            WHERE client_id = :client_id 
            AND timestamp = :timestamp
        """)
        db.execute(update_query, {
            'client_id': client_id,
            'timestamp': current_time
        })
        db.commit()

        return audio_data

    except Exception as e:
        db.rollback()  # Roll back any failed transaction
        try:
            # Try to save error status
            error_query = text("""
                INSERT INTO messages (client_id, text, response, timestamp, type, status, created_at, updated_at)
                VALUES (:client_id, :text, :response, :timestamp, 'audio', 'failed', :created_at, :updated_at)
            """)
            
            db.execute(error_query, {
                'client_id': client_id,
                'text': str(e),
                'response': 'Error processing audio',
                'timestamp': current_time,
                'created_at': current_time,
                'updated_at': current_time
            })
            db.commit()
        except:
            db.rollback()
        raise e
    finally:
        db.close()

def multimodal_process_gemini_pro(audio_file, image_url: str, client_id: str, language: str = "en"):
    """
    Processes audio and image data using Gemini Vision Pro for multimodal AI applications.
    """
    # Get Istanbul timezone for UTC+3
    istanbul_tz = timezone('Europe/Istanbul')
    current_time = datetime.now(istanbul_tz)
    print("Basladi")
    print(current_time)
    print(client_id)
    print(language)
    print(audio_file)
    print(image_url)
    # Get database session
    db = next(get_db())

    try:
        image_file = Image.open(image_url)

        # Step 1: Use Groq for transcription
        client = Groq()
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3-turbo",
            language=language,
            response_format="verbose_json",
        )
        transcribed_text = transcription.text
        print("Transcribed text")
        print(transcribed_text)

        genai.configure(api_key="AIzaSyAUuUp27Hpz2JbHi3gWvd_WCSwuuIH-ybo")
        model = genai.GenerativeModel(model_name="gemini-1.5-pro")

        response = model.generate_content([transcribed_text, image_file])
        print("Response")
        print(response)


        # Save to database using SQLAlchemy text()
        query = text("""
            INSERT INTO messages (client_id, text, response, timestamp, type, status, created_at, updated_at)
            VALUES (:client_id, :text, :response, :timestamp, 'multimodal', 'pending', :created_at, :updated_at)
        """)
        
        db.execute(query, {
            'client_id': client_id,
            'text': transcribed_text,
            'response': response.text,
            'timestamp': current_time,
            'created_at': current_time,
            'updated_at': current_time
        })
        db.commit()

        # Step 3: Text-to-speech
        global voice_id
        audio_data = elevenlabs_client.generate(
            text=response.text,
            voice=voice_id,
            model="eleven_multilingual_v2"
        )

        # Update status to delivered
        update_query = text("""
            UPDATE messages 
            SET status = 'delivered'
            WHERE client_id = :client_id 
            AND timestamp = :timestamp
        """)
        db.execute(update_query, {
            'client_id': client_id,
            'timestamp': current_time
        })
        db.commit()

        return audio_data

    except Exception as e:
        db.rollback()  # Roll back any failed transaction
        try:
            # Try to save error status
            error_query = text("""
                INSERT INTO messages (client_id, text, response, timestamp, type, status, created_at, updated_at)
                VALUES (:client_id, :text, :response, :timestamp, 'multimodal', 'failed', :created_at, :updated_at)
            """)
            
            db.execute(error_query, {
                'client_id': client_id,
                'text': str(e),
                'response': 'Error processing multimodal data',
                'timestamp': current_time,
                'created_at': current_time,
                'updated_at': current_time
            })
            db.commit()
        except:
            db.rollback()
        raise e
    finally:
        db.close()

# if __name__ == '__main__':
#     import logging
#
#     # Configure logging
#     logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
#
#     # Example inputs
#     audio_file_path = "/home/main/Documents/Havelsan/normal_temp.mp3"
#     vision_audio_file_path = "/home/main/Documents/Havelsan/vision_temp.mp3"
#     image_url = "/home/main/Documents/Havelsan/OYH_mind-blowing-facts.jpg"  # Replace with your image URL
#     language_audio = "en"
#
#     # Call the first method
#     logging.info("Calling speech_to_text_gemini_generation_tts...")
#     with open(audio_file_path, "rb") as audio_file:
#         audio_result = speech_to_text_gemini_generation_tts(audio_file=audio_file, language=language_audio)
#     logging.info(f"Output from speech_to_text_gemini_generation_tts: {audio_result}")
#
#     # Call the second method
#     logging.info("Calling multimodal_process_gemini_pro...")
#     with open(vision_audio_file_path, "rb") as audio_file:
#         multimodal_result = multimodal_process_gemini_pro(audio_file=audio_file, image_url=image_url, language=language_audio)
#     logging.info(f"Output from multimodal_process_gemini_pro: {multimodal_result}")

def predict_normal_chat(text: str, client_id: str):
    """
    Generates a response in Turkish for a given input and saves to database.
    """
    # Get Istanbul timezone and database session
    istanbul_tz = timezone('Europe/Istanbul')
    current_time = datetime.now(istanbul_tz)
    db = next(get_db())
    
    try:
        # Gemini Flash generation
        gemini_messages = [
            ("system", "You are a helpful assistant. Speak in Turkish"),
            ("human", text),
        ]
        gemini_response = gemini_client.invoke(gemini_messages)
        generated_text = gemini_response.content

        # Save to database using SQLAlchemy text()
        query = text("""
            INSERT INTO messages (client_id, text, response, timestamp, type, status, created_at, updated_at)
            VALUES (:client_id, :text, :response, :timestamp, 'text', 'completed', :created_at, :updated_at)
        """)
        
        db.execute(query, {
            'client_id': client_id,
            'text': text,
            'response': generated_text,
            'timestamp': current_time,
            'created_at': current_time,
            'updated_at': current_time
        })
        db.commit()
        
        return generated_text

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def predict_vision_chat(text: str, image_url: str, client_id: str):
    """
    Uses a generative AI model to analyze input text and image, and saves to database.
    """
    # Get Istanbul timezone and database session
    istanbul_tz = timezone('Europe/Istanbul')
    current_time = datetime.now(istanbul_tz)
    db = next(get_db())
    
    try:
        image_file = Image.open(image_url)
        genai.configure(api_key="AIzaSyAUuUp27Hpz2JbHi3gWvd_WCSwuuIH-ybo")
        model = genai.GenerativeModel(model_name="gemini-1.5-pro")
        response = model.generate_content([text, image_file])
        
        # Save to database using SQLAlchemy text()
        query = text("""
            INSERT INTO messages (client_id, text, response, timestamp, type, status, created_at, updated_at)
            VALUES (:client_id, :text, :response, :timestamp, 'vision', 'completed', :created_at, :updated_at)
        """)
        
        db.execute(query, {
            'client_id': client_id,
            'text': text,
            'response': response.text,
            'timestamp': current_time,
            'created_at': current_time,
            'updated_at': current_time
        })
        db.commit()
        
        return response.text

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()