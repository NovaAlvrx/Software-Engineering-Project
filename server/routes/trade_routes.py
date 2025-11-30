from fastapi import APIRouter, HTTPException, Cookie, Body, Depends
from typing import Optional, List
from prisma.enums import ExchangeStatus
from core.database import db
from services.auth_services import get_current_user

router = APIRouter(prefix="/trade", tags=["trade"])


async def current_user_from_cookie(access_token: Optional[str] = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return await get_current_user(access_token)


@router.post("")
async def create_trade(
    recipientId: int = Body(..., embed=True),
    offer: Optional[str] = Body(None, embed=True),
    request: Optional[str] = Body(None, embed=True),
    availability: Optional[str] = Body(None, embed=True),
    message: Optional[str] = Body(None, embed=True),
    current_user=Depends(current_user_from_cookie),
):
    """
    Create a new trade/exchange request. The caller is userOne (sender) and recipient is userTwo.
    """
    if recipientId == current_user["id"]:
        raise HTTPException(status_code=400, detail="Cannot request a trade with yourself")

    # Ensure recipient exists
    recipient = await db.user.find_unique(where={"userId": recipientId})
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    exchange = await db.exchange.create(
        data={
            "userOneId": current_user["id"],
            "userTwoId": recipientId,
            "status": ExchangeStatus.PENDING,
            "offer": offer,
            "request": request,
            "availability": availability,
            "message": message,
        },
    )

    return {"id": exchange.exchangeId, "status": exchange.status}


@router.get("")
async def list_trades(current_user=Depends(current_user_from_cookie)):
    """
    List incoming and outgoing trades for the current user.
    """
    trades = await db.exchange.find_many(
        where={
            "OR": [
                {"userOneId": current_user["id"]},
                {"userTwoId": current_user["id"]},
            ]
        },
        include={"sender": {"include": {"user": True}}, "receiver": {"include": {"user": True}}},
        order={"createdAt": "desc"},
    )

    incoming = []
    outgoing = []
    for trade in trades:
        other_user = trade.sender if trade.userTwoId == current_user["id"] else trade.receiver
        full_name = ""
        if other_user and getattr(other_user, "user", None):
            full_name = f"{other_user.user.fName} {other_user.user.lName}"
        shaped = {
            "id": trade.exchangeId,
            "status": trade.status,
            "offer": trade.offer,
            "request": trade.request,
            "availability": trade.availability,
            "message": trade.message,
            "sentAt": trade.createdAt,
            "otherUser": {
                "id": other_user.userId,
                "name": full_name,
                "profilePicture": getattr(other_user, "profile_picture", None),
            },
        }
        if trade.userTwoId == current_user["id"]:
            incoming.append(shaped)
        else:
            outgoing.append(shaped)

    return {"incoming": incoming, "outgoing": outgoing}


@router.patch("/{exchange_id}")
async def update_trade_status(
    exchange_id: int,
    status: ExchangeStatus = Body(..., embed=True),
    current_user=Depends(current_user_from_cookie),
):
    """
    Update a trade status. Only participants can update. Accept/decline restricted to recipient.
    """
    trade = await db.exchange.find_unique(where={"exchangeId": exchange_id})
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")

    if current_user["id"] not in [trade.userOneId, trade.userTwoId]:
        raise HTTPException(status_code=403, detail="Not allowed on this trade")

    # Only recipient can accept/decline
    if status in [ExchangeStatus.ACCEPTED, ExchangeStatus.DECLINED] and current_user["id"] != trade.userTwoId:
        raise HTTPException(status_code=403, detail="Only the recipient can respond to this trade")

    updated = await db.exchange.update(
        where={"exchangeId": exchange_id},
        data={"status": status},
    )
    return {"id": updated.exchangeId, "status": updated.status}
