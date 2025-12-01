from fastapi import APIRouter, HTTPException, Form, Depends, status, Response, Cookie
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from services.auth_services import register_user
from services.auth_services import authenticate_user, get_current_user, create_token
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 7 * 24 * 60  # 7 days

@router.post("/sign-up")
async def sign_up(first_name: Annotated[str, Form()],
                  last_name: Annotated[str, Form()],
                  email: Annotated[str, Form()], 
                  password: Annotated[str, Form()],
                  response: Response
                  ):
    try: 
        await register_user(first_name, last_name, email, password)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = await create_token(data={"sub": email}, expires_delta=access_token_expires)

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60, # in seconds
            samesite="lax"
        )
        
        return {"message": "User registered successfully"}
    except Exception as e:
        print("Unexpected error during sign-up:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        user = await authenticate_user(form_data.username, form_data.password) # returns email
        print('Authenticated user:', user)
        if not user:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = await create_token(data={"sub": user}, expires_delta=access_token_expires)

        print('Generated access token:', access_token)

        response = JSONResponse(content={"message": "Login successful"})

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            samesite="lax",
            path="/"
        )

        return response

    except Exception as e:
        print("Unexpected error during login:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/me")
async def read_users_me(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = await get_current_user(access_token)
        return payload
    except Exception as e:
        print("Error validating token in /me endpoint:", e)
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        samesite="lax",
        path="/"
    )
    return {"message": "Logged out successfully"}
