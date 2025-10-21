# server/main.py
from fastapi import FastAPI, HTTPException

app = FastAPI()

# Mock "database"
users = {}

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/signup")
def signup(email: str, password: str):
    if not email or not password:
        raise HTTPException(status_code=400, detail="Signup cancelled — missing info")
    if email in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[email] = password
    return {"message": "Account created successfully"}

@app.post("/login")
def login(email: str, password: str):
    if not email or not password:
        raise HTTPException(status_code=400, detail="Login cancelled — missing info")
    if email not in users:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if users[email] != password:
        raise HTTPException(status_code=401, detail="Incorrect password")
    return {"message": "Login successful"}