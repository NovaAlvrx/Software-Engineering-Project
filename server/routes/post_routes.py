from fastapi import APIRouter, HTTPException
from core.database import db
from pydantic import BaseModel

router = APIRouter(prefix='/posts', tags=["posts"])

class LikeRequest(BaseModel):
    postId: int
    userId: int

@router.post('/toggle-like')
async def toggle_like(data: LikeRequest):
    print(f'Liked Post ID: {data.postId}, Liked by User ID: {data.userId}')
    try:
        await db.like.create(data={"postId": data.postId, "userId": data.userId})
        return {"message": "Post liked"}
    except Exception as e:
        print('Error toggling like status:', e)
        raise HTTPException(status_code=500, detail='Error toggling like status')
    
@router.delete('/toggle-unlike')
async def toggle_unlike(data: LikeRequest):
    print(f'Unliked Post ID: {data.postId}, Unliked by User ID: {data.userId}')
    try: 
        await db.like.delete(
            where={"postId_userId": {
                    "postId": data.postId, 
                    "userId": data.userId
                    }
                }
            )
        return {"message": "Post unliked"}
    except Exception as e:
        print('Error removing like status:', e)
        raise HTTPException(status_code=500, detail='Error toggling like status')