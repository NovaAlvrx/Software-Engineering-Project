from passlib.hash import argon2
from fastapi import HTTPException
from prisma.errors import UniqueViolationError
from core.database import db
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os
import jwt
from datetime import datetime, timedelta, timezone
from jwt.exceptions import InvalidTokenError

load_dotenv()

def verify_password(plain_password, hashed_password):
    return argon2.verify(plain_password, hashed_password)

def get_password_hash(password):
    return argon2.hash(password)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def create_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    print('Created JWT token:', encoded_jwt)
    return encoded_jwt

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

async def authenticate_user(email:str, password:str):
    print('Authenticating user with email:', email)
    user = await db.user.find_unique(where={"email": email})
    print('Fetched user for authentication:', user)

    if not user:
        return None
    
    try:
        if not verify_password(password, user.password):
            return None
    except Exception as e:
        print("Error hashing password during authentication:", e)
        return None

    return email

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            print('Could not find email')
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    
    user = await db.user.find_unique(where={"email": email})

    if not user:
        raise credentials_exception
    
    print('user id: ', user.userId)
    
    return {"id": user.userId, "fName": user.fName, "lName": user.lName}