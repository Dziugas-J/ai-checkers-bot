# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.game_logic import create_initial_board
from app.models import Board

app = FastAPI(
    title="Checkers AI Coach API",
    description="Backend API for the Checkers AI Coach project",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "Checkers AI Coach API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
    }


@app.get("/test-board")
def test_board() -> dict[str, Board]:
    return {
        "board": create_initial_board(),
    }