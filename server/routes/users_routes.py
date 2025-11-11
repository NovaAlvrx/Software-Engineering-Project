from fastapi import APIRouter, Depends, HTTPException, Form
from prisma import Prisma
from core.database import db
from typing import Optional
import json

router = APIRouter(prefix='/users', tags=["users"])

@router.get('/profile')
async def get_profile_data(id: int):
    print('Userid: ', id)
    try:
        user_data = await db.userprofile.find_unique(
                        where={"userId": id},
                        include={"targetSkills": True, "posts": True, "skills": True, "reviewsReceived": True}
                        )
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

        wish_list = [skill.skillName for skill in user_data.targetSkills]
        print(wish_list)

        return {'user_name': user_name, 'user_data': user_data, 'wish_list': wish_list}

    except Exception as e:
        print('Error getting user profile data: ', e) 
        return None
    
@router.patch('/update')
async def update_profile_data(id: int, 
                              fName: Optional[str] = Form(None),
                              lName: Optional[str] = Form(None),
                              wishList: Optional[str] = Form(None)):
    print('In /update wishlist: ', wishList)
    try:
        if fName or lName:
            try:
                await db.user.update(
                    where={'userId': id},
                    data={
                        **({"fName": fName} if fName else {}), #{} does not update 
                        **({"lName": lName} if lName else {})
                    }
                )
                print('Updating user: ', id)
            except Exception as e:
                print('Error updating name: ', e)

        if wishList:
            try:
                print('Updating wish list of user: ', id)
                skills = json.loads(wishList)
                existing = await db.targetskill.find_many(where={"userId": id})
                existing_skill_names = {s.skillName for s in existing}
                new_skill_names = set(skills)

                for new_skill in new_skill_names - existing_skill_names:
                    print('new_skill: ', new_skill)
                    await db.targetskill.create(data={"userId": id, "skillName": new_skill})

                for old_skill in existing_skill_names - new_skill_names:
                    print('old skill: ', old_skill)
                    await db.targetskill.delete_many(where={"userId": id, "skillName": old_skill})

                return {"message: ": "Profile updated successfully"}

            except Exception as e:
                print('Error updating wish list: ', e)

    except Exception as e:
        print('Error occured updating profile data: ', e)
        return None