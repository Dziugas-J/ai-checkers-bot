from app.bot import apply_bot_move
from app.game import create_new_game
from app.models import Difficulty, HintResponse, LegalMove, MatchState
from app.moves import apply_move, get_moves


def create_new_match(difficulty: Difficulty) -> MatchState:
    return MatchState(
        game=create_new_game(),
        difficulty=difficulty,
        player_score=0,
        computer_score=0,
    )

def create_match_with_game(match: MatchState, game) -> MatchState:
    return MatchState(
        game=game,
        difficulty=match.difficulty,
        player_score=match.player_score,
        computer_score=match.computer_score,
    )

def reset_match_board(match: MatchState) -> MatchState:
    return MatchState(
        game=create_new_game(),
        difficulty=match.difficulty,
        player_score=match.player_score,
        computer_score=match.computer_score,
    )

def add_score_if_game_finished(match: MatchState) -> MatchState:
    if match.game.winner is None:
        return match

    player_score = match.player_score
    computer_score = match.computer_score

    if match.game.winner == "white":
        player_score += 1

    if match.game.winner == "black":
        computer_score += 1

    return MatchState(
        game=create_new_game(),
        difficulty=match.difficulty,
        player_score=player_score,
        computer_score=computer_score,
    )

def get_match_legal_moves(
    match: MatchState,
    row: int,
    col: int,
) -> list[LegalMove]:
    return get_moves(
        match.game,
        row,
        col,
    )


def apply_player_move_to_match(
    match: MatchState,
    start_row: int,
    start_col: int,
    target_row: int,
    target_col: int,
) -> MatchState:
    if match.game.current_player != "white":
        return match

    game_after_player_move = apply_move(
        match.game,
        start_row,
        start_col,
        target_row,
        target_col,
    )

    updated_match = create_match_with_game(
        match,
        game_after_player_move,
    )

    updated_match = add_score_if_game_finished(updated_match)

    if updated_match.game.current_player != "black":
        return updated_match

    if updated_match.game.winner is not None:
        return updated_match

    game_after_bot_move = apply_bot_move(
        updated_match.game,
        updated_match.difficulty,
    )

    updated_match = create_match_with_game(
        updated_match,
        game_after_bot_move,
    )

    return add_score_if_game_finished(updated_match)


def get_match_hint(match: MatchState) -> HintResponse:
    return HintResponse(
        hint="Since this is the current position, look for forced captures first. If no capture is available, try to move toward the center while keeping your back row protected."
    )