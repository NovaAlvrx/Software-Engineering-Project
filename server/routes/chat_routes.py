from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from core.database import db

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
    sentAt: str

async def get_or_create_conversation(u1: int, u2: int):
    convo = await db.conversation.find_first(
        where={
            "messages": {
                "some": {
                    "OR": [
                        {"senderId": u1, "recipientId": u2},
                        {"senderId": u2, "recipientId": u1}
                    ]
                }
            }
        }
    )

    if convo:
        return convo.id

    new_convo = await db.conversation.create(data={})
    return new_convo.id


#Message List
@router.get("/conversations/{user_id}")
async def get_user_conversations(user_id: int):

    conversations = await db.conversation.find_many(
        where={
            "messages": {
                "some": {
                    "OR": [
                        {"senderId": user_id},
                        {"recipientId": user_id}
                    ]
                }
            }
        },
        include={
            "messages": {
                "orderBy": {"sentAt": "desc"},
                "take": 1
            }
        }
    )

    result = []
    for c in conversations:
        last = c.messages[0]
        other = last.recipientId if last.senderId == user_id else last.senderId

        result.append({
            "conversationId": c.id,
            "otherUserId": other,
            "lastMessage": last.body,
            "lastAt": str(last.sentAt)
        })

    return result

@router.post("/", response_model=MessageOut)
async def send_message(msg: MessageCreate):

    convo_id = await get_or_create_conversation(msg.sender_id, msg.recipient_id)

    new_msg = await db.message.create(
        data={
            "body": msg.content,
            "senderId": msg.sender_id,
            "recipientId": msg.recipient_id,
            "conversationId": convo_id
        }
    )

    return MessageOut(
        id=new_msg.id,
        sender_id=new_msg.senderId,
        recipient_id=new_msg.recipientId,
        content=new_msg.body,
        sentAt=str(new_msg.sentAt)
    )


# dms
@router.get("/{u1}/{u2}", response_model=List[MessageOut])
async def get_messages(u1: int, u2: int):

    convo_id = await get_or_create_conversation(u1, u2)

    rows = await db.message.find_many(
        where={"conversationId": convo_id},
        order={"sentAt": "asc"}
    )

    return [
        MessageOut(
            id=r.id,
            sender_id=r.senderId,
            recipient_id=r.recipientId,
            content=r.body,
            sentAt=str(r.sentAt)
        ) for r in rows
    ]
