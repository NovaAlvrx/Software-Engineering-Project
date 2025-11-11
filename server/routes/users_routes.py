from fastapi import APIRouter, Depends, HTTPException
from prisma import Prisma
from core.database import db

router = APIRouter(prefix='/users', tags=["users"])

@router.get('/profile')
async def get_profile_data(id: int):
    print('Userid: ', id)
    try:
        user_data = await db.userprofile.find_unique(where={"userId": id})
        user_name = await db.user.find_unique(where={"userId": id})

        print('From UserProfile table')
        print('User pfp: ', user_data.profile_picture)
        print('User posts: ', user_data.posts)
        print('User skills: ', user_data.skills)
        print('User wanting to learn: ', user_data.targetSkills)
        print('User reviews: ', user_data.reviewsReceived)

        print('From User table')
        print('User fName: ', user_name.fName)
        print('User lName: ', user_name.lName)

        return {'user_name': user_name, 'user_data': user_data}

    except Exception as e:
        print('Error getting user profile data: ', e) 
        return None
    