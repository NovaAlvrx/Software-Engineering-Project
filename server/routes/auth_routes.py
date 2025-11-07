from fastapi import APIRouter, HTTPException, Form
from typing import Annotated
from services.auth_services import register_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/sign-up")
async def sign_up(first_name: Annotated[str, Form()],
                  last_name: Annotated[str, Form()],
                  email: Annotated[str, Form()], 
                  password: Annotated[str, Form()]):
    try: 
        await register_user(first_name, last_name, email, password)
        return {"message": "User registered successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print("Unexpected error during sign-up:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.post("/login")
async def login():
    pass