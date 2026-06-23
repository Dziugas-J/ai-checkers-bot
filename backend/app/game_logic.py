# backend/app/game_logic.py

from app.models import Board


BOARD_SIZE = 8


def create_initial_board() -> Board:
    board: Board = []

    for row in range(BOARD_SIZE):
        board_row = []

        for col in range(BOARD_SIZE):
            is_dark_square = (row + col) % 2 == 1

            if is_dark_square and row < 3:
                board_row.append("black")
            elif is_dark_square and row > 4:
                board_row.append("red")
            else:
                board_row.append("empty")

        board.append(board_row)

    return board