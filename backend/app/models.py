from typing import Literal, TypeAlias

from pydantic import BaseModel

Piece: TypeAlias = Literal[
    "empty",
    "white",
    "black",
    "white_king",
    "black_king",
]

Player: TypeAlias = Literal["white", "black"]
Board: TypeAlias = list[list[Piece]]

Difficulty: TypeAlias = Literal["easy", "medium", "hard"]

class Position(BaseModel):
    row: int
    col: int

class LegalMove(BaseModel):
    row: int
    col: int
    is_capture: bool
    captured_piece: Position | None = None

class GameState(BaseModel):
    board: Board
    current_player: Player
    winner: Player | None = None
    must_continue_capture: bool = False
    forced_piece: Position | None = None

class MoveRequest(BaseModel):
    game: GameState
    start_row: int
    start_col: int
    target_row: int
    target_col: int

class LegalMovesRequest(BaseModel):
    game: GameState
    row: int
    col: int

class BotMoveRequest(BaseModel):
    game: GameState
    difficulty: Difficulty

class MatchState(BaseModel):
    game: GameState
    difficulty: Difficulty
    player_score: int = 0
    computer_score: int = 0

class NewMatchRequest(BaseModel):
    difficulty: Difficulty

class MatchMoveRequest(BaseModel):
    match: MatchState
    start_row: int
    start_col: int
    target_row: int
    target_col: int

class MatchLegalMovesRequest(BaseModel):
    match: MatchState
    row: int
    col: int

class HintRequest(BaseModel):
    match: MatchState

class HintResponse(BaseModel):
    hint: str