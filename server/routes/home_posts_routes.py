from fastapi import APIRouter, HTTPException
from core.database import db
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict

router = APIRouter(prefix='/home', tags=["home"])

@router.get('/posts')
async def get_posts(days: int = 7, userId: Optional[int] = None):
    """Return posts created within the last `days` days (default 7)."""
    try:
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(days=days) 

        fetch_posts = await db.post.find_many(where={"createdAt": {"gte": cutoff}})

        if fetch_posts is None:
            return get_posts(days=days+7, userId=userId)

        # Count posts that are liked in fetched posts
        like_counts = await db.like.group_by(
            by=["postId"],
            count={"postId": True},
            where={
                "postId": {"in": [p.postId for p in fetch_posts]}
        })

        # Map postId to like count
        like_map = {item["postId"]: item["_count"]["postId"] for item in like_counts}

        result = []
        for p in fetch_posts:
            result.append({
                **p.__dict__, #copies all fields of post then add line below
                "likeCount": like_map.get(p.postId, 0)
            })

        if userId:
            user_likes_map = await get_user_likes_map(userId, fetch_posts)
            for post in result:
                post["likedByUser"] = post["postId"] in user_likes_map

        return {"posts": result}
    except Exception as e:
        print('Error fetching recent posts:', e)
        raise HTTPException(status_code=500, detail='Error fetching recent posts')
    
async def get_user_likes_map(userId: int, fetched_posts: Dict[str, str]) -> Dict[str, bool]:
    # Get likes by the user for the fetched posts {postId, userId}
    user_likes = await db.like.find_many(where={"userId": userId, "postId": {"in": [p.postId for p in fetched_posts]}})
        
    # Set of postId
    liked_post_ids = {l.postId for l in user_likes}

    return liked_post_ids