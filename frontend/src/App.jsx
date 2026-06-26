import { useEffect, useState } from "react";
import { fetchNewGame, fetchLegalMoves, sendMove, sendBotMove } from "./Api";
import "./App.css";

function App() {
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [botDifficulty, setBotDifficulty] = useState("easy");

    async function startNewGame() {
        setLoading(true);
        setSelectedPiece(null);
        setPossibleMoves([]);

        const data = await fetchNewGame();
        setGame(data);

        setLoading(false);
    }

    useEffect(() => {
        startNewGame();
    }, []);

    function isSquareSelected(row, col) {
        return (
            selectedPiece !== null &&
            selectedPiece.row === row &&
            selectedPiece.col === col
        );
    }

    function getMoveForSquare(row, col) {
        return possibleMoves.find(
            (move) => move.row === row && move.col === col
        );
    }

    function isPossibleMoveSquare(row, col) {
        return getMoveForSquare(row, col) !== undefined;
    }

    function getNewGameButtonText() {
        if (loading) {
            return "Loading...";
        }

        return "New Game";
    }

    function getSquareClassName(row, col, possibleMove) {
        let squareClass = "square";

        const isDarkSquare = (row + col) % 2 === 1;

        if (isDarkSquare) {
            squareClass += " dark";
        }
        else {
            squareClass += " light";
        }

        if (possibleMove) {
            squareClass += " possible-move";

            if (possibleMove.is_capture) {
                squareClass += " capture-move";
            }
        }

        return squareClass;
    }

    function clearSelectedPiece() {
        setSelectedPiece(null);
        setPossibleMoves([]);
    }

    async function selectPieceAndLoadMoves(row, col) {
        const moves = await fetchLegalMoves(game, row, col);

        if (moves.length === 0) {
            clearSelectedPiece();
            return;
        }

        setSelectedPiece({ row, col });
        setPossibleMoves(moves);
    }

    async function applySelectedMove(targetRow, targetCol) {
        const selectedMove = getMoveForSquare(targetRow, targetCol);

        if (!game || !selectedPiece || !selectedMove) {
            return;
        }

        const updatedGame = await sendMove(
            game,
            selectedPiece.row,
            selectedPiece.col,
            targetRow,
            targetCol
        );

        setGame(updatedGame);

        if (updatedGame.must_continue_capture && updatedGame.forced_piece){
            setSelectedPiece({
                row: updatedGame.forced_piece.row,
                col: updatedGame.forced_piece.col,
            });

            const nextMoves = await fetchLegalMoves(
                updatedGame,
                updatedGame.forced_piece.row,
                updatedGame.forced_piece.col
            );

            setPossibleMoves(nextMoves);
            return;
        }

        if (updatedGame.current_player === "black"){
            const gameAfterBotMove = await sendBotMove(updatedGame, botDifficulty);
            setGame(gameAfterBotMove);
            clearSelectedPiece();
            return;
        }

        clearSelectedPiece();
    }

    async function handleSquareClick(row, col) {
        if (!game) {
            return;
        }

        if (isPossibleMoveSquare(row, col)) {
            await applySelectedMove(row, col);
            return;
        }

        const piece = game.board[row][col];

        if (piece === "empty") {
            clearSelectedPiece();
            return;
        }

        if (isSquareSelected(row, col)) {
            clearSelectedPiece();
            return;
        }

        await selectPieceAndLoadMoves(row, col);
    }

    function renderPiece(piece, row, col) {
        if (piece === "empty") {
            return null;
        }

        let pieceClass = `piece ${piece}`;

        if (isSquareSelected(row, col)) {
            pieceClass += " selected";
        }

        return (
            <div className={pieceClass}></div>
        );
    }

    function renderGame() {
        if (!game) {
            return null;
        }

        return (
            <section className="game-info">
                <p>
                    <strong>Current player:</strong> {game.current_player}
                </p>

                <div className="board">
                    {game.board.map((row, rowIndex) =>
                        row.map((piece, colIndex) => {
                            const possibleMove = getMoveForSquare(rowIndex, colIndex);

                            const squareClass = getSquareClassName(
                                rowIndex,
                                colIndex,
                                possibleMove
                            );

                            return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={squareClass}
                                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                                >
                                    {renderPiece(piece, rowIndex, colIndex)}
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        );
    }

    return (
        <main className="app">
            <h1>AI Checkers Coach</h1>

            <button onClick={startNewGame} disabled={loading}>
                {getNewGameButtonText()}
            </button>

            <select
                value={botDifficulty}
                onChange={(event) => setBotDifficulty(event.target.value)}
            >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>

            {renderGame()}
        </main>
    );
}

export default App;