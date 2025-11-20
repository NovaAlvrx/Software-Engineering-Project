from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from core.database import get_db
from sqlalchemy.orm import Session
from models import ChatMessage  # your SQLAlchemy model for messages

router = APIRouter(prefix="/chat", tags=["chat"])

class MessageCreate(BaseModel):
    sender_id: int
    recipient_id: int
    content: str

class MessageOut(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    content: str

@router.post("/", response_model=MessageOut)
def send_message(msg: MessageCreate, db: Session = Depends(get_db)):
    chat_msg = ChatMessage(sender_id=msg.sender_id, recipient_id=msg.recipient_id, content=msg.content)
    db.add(chat_msg)
    db.commit()
    db.refresh(chat_msg)
    return chat_msg

@router.get("/{user1_id}/{user2_id}", response_model=List[MessageOut])
def get_messages(user1_id: int, user2_id: int, db: Session = Depends(get_db)):
    msgs = db.query(ChatMessage).filter(
        ((ChatMessage.sender_id == user1_id) & (ChatMessage.recipient_id == user2_id)) |
        ((ChatMessage.sender_id == user2_id) & (ChatMessage.recipient_id == user1_id))
    ).order_by(ChatMessage.id.asc()).all()
    return msgs
