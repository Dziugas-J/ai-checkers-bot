from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.board import create_board
from app.game import create_new_game
from app.models import Board, BotMoveRequest, GameState, LegalMove, LegalMovesRequest, MoveRequest
from app.moves import apply_move, get_moves
from app.bot import apply_bot_move

app = FastAPI(title="AI Checkers Coach", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/checkers")
def test_board() -> dict[str, Board]:
    return {"board": create_board()}

@app.post("/game/new")
def new_game() -> GameState:
    return create_new_game()

@app.post("/game/move")
def make_move(move_request: MoveRequest) -> GameState:
    return apply_move(
        move_request.game,
        move_request.start_row,
        move_request.start_col,
        move_request.target_row,
        move_request.target_col,
    )

@app.post("/game/legal-moves")
def get_legal_moves(request: LegalMovesRequest) -> list[LegalMove]:
    return get_moves(
        request.game,
        request.row,
        request.col,
    )

@app.post("/game/bot-move")
def make_bot_move(request: BotMoveRequest) -> GameState:
    return apply_bot_move(
        request.game,
        request.difficulty,
    )