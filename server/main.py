from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import connect_db, disconnect_db
from routes import auth_routes, users_routes, upload_routes, home_posts_routes, post_routes, chat_routes, trade_routes

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await connect_db()

@app.on_event("shutdown")
async def on_shutdown():
    await disconnect_db()

app.include_router(auth_routes.router)
app.include_router(users_routes.router)
app.include_router(upload_routes.router)
app.include_router(home_posts_routes.router)
app.include_router(post_routes.router)
app.include_router(chat_routes.router)
app.include_router(trade_routes.router)

# Add CORS middleware to allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",        # Vite default port (hostname)
        "http://127.0.0.1:5173",        # Vite when accessed via loopback IP
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ACCESS_TOKEN_EXPIRE_MINUTES = 7 * 24 * 60  # 7 days

@app.get("/")
async def root():
    return {"message": "Hello World"}
