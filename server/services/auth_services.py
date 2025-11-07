from passlib.hash import argon2
from fastapi import HTTPException
from prisma.errors import UniqueViolationError
from core.database import db

def verify_password(plain_password, hashed_password):
    return argon2.verify(plain_password, hashed_password)

def get_password_hash(password):
    return argon2.hash(password)

async def register_user(first_name: str, last_name: str, email: str, password: str):
    exisiting_user = await db.user.find_unique(where={"email": email})
    if exisiting_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(password)

    try:
        new_user = await db.user.create(
            data={
                "fName": first_name,
                "lName": last_name,
                "email": email,
                "password": hashed_password
            }
        )

        await db.userprofile.create(
            data={
                "userId": new_user.userId
            }
        )

    except UniqueViolationError:
        raise HTTPException(status_code=400, detail="Email already registered")

async def authenticate_user(email: str, password: str):
    user = await db.user.find_unique(where={"email": email})
    if not user:
        return HTTPException(status_code=400, detail="Invalid email")
    
    hashed_password = get_password_hash(password)
    if not verify_password(hashed_password, user.password):
        return HTTPException(status_code=400, detail="Invalid password")
    