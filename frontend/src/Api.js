const API_URL = "http://127.0.0.1:8000";

export async function fetchNewGame() {
    const response = await fetch(`${API_URL}/game/new`, {
        method: "POST",
    });

    const data = await response.json();
    return data;
}

export async function sendMove(game, startRow, startCol, targetRow, targetCol) {
    const response = await fetch(`${API_URL}/game/move`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            game: game,
            start_row: startRow,
            start_col: startCol,
            target_row: targetRow,
            target_col: targetCol,
        }),
    });

    const data = await response.json();
    return data;
}

export async function fetchLegalMoves(game, row, col) {
    const response = await fetch(`${API_URL}/game/legal-moves`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            game: game,
            row: row,
            col: col,
        }),
    });

    const data = await response.json();
    return data;
}

export async function sendBotMove(game, difficulty) {
    const response = await fetch(`${API_URL}/game/bot-move`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            game: game,
            difficulty: difficulty,
        }),
    });

    const data = await response.json();
    return data;
}