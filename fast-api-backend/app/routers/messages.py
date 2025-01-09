from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, auth
from ..database import get_db
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

@router.post("/messages/", response_model=Message)
async def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_message = models.Message(
        content=message.content,
        user_id=current_user.id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/messages/", response_model=List[Message])
async def read_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    messages = db.query(models.Message).filter(
        models.Message.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return messages

@router.get("/messages/{message_id}", response_model=Message)
async def read_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    message = db.query(models.Message).filter(
        models.Message.id == message_id,
        models.Message.user_id == current_user.id
    ).first()
    if message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

@router.put("/messages/{message_id}", response_model=Message)
async def update_message(
    message_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_message = db.query(models.Message).filter(
        models.Message.id == message_id,
        models.Message.user_id == current_user.id
    ).first()
    if db_message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db_message.content = message.content
    db_message.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_message)
    return db_message

@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_message = db.query(models.Message).filter(
        models.Message.id == message_id,
        models.Message.user_id == current_user.id
    ).first()
    if db_message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(db_message)
    db.commit()
    return None 