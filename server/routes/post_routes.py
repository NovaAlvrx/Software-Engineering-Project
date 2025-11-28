from fastapi import APIRouter, HTTPException, Depends
from core.database import db
from pydantic import BaseModel

router = APIRouter(prefix='/posts', tags=["posts"])

class LikeRequest(BaseModel):
    postId: int
    userId: int

class FetchCommentsRequest(BaseModel):
    postId: int

class AddCommentRequest(BaseModel):
    postId: int
    userId: int
    comment: str

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

async def get_commenter(userId: int):
    commenter_username = await db.user.find_unique(where={"userId": userId})
    commenter_pfp = await db.userprofile.find_unique(where={"userId": userId})

    commenter_details = {
        "username": f"{commenter_username.fName} {commenter_username.lName}",
        "profile_pic": commenter_pfp.profile_picture
    }

    print('Details of commenter: ', commenter_details)

    return commenter_details

@router.get('/comments')
async def get_comments(params: FetchCommentsRequest = Depends()):
    try:
        comments = await db.comment.find_many(where={"postId": params.postId})
        print(f'Comments from post {params.postId}: ', comments)

        comments_details = []

        for comment in comments:
            commenter_details = await get_commenter(comment.userId)

            comments_details.append({
                "comment": comment.content,
                "user": commenter_details['username'],
                "pfp": commenter_details['profile_pic']
            })

        print(comments_details)

        return { 'comments': comments_details }
    except Exception as e:
        print('Error fetching comments: ', e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/add_comment')
async def add_comment(params: AddCommentRequest):
    print('Adding comment: ', params)
    try:
        await db.comment.create(data={
                        "postId": params.postId, 
                        "userId": params.userId, 
                        "content": params.comment})
        
        return {"Message": "Comment added"}
    except Exception as e:
        print('Error adding comment: ', e)
        raise HTTPException(status_code=500, detail=str(e))