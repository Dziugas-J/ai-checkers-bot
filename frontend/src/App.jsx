import controllers from "./components/controllers";
import {
    capitalizeDifficulty,
    countPieces,
    getMoveForSquare,
    getSquareClassName,
    isSquareSelected,
} from "./components/helpers";
import "./styles/base.css";
import "./styles/board.css";
import "./styles/ui.css";

function App() {
    const {
        game,
        selectedPiece,
        possibleMoves,
        botDifficulty,
        hint,
        difficultyDropdownOpen,
        playerScore,
        computerScore,
        startNewGame,
        handleSquareClick,
        getHint,
        toggleDifficultyDropdown,
        selectDifficulty,
    } = controllers();

    function renderPiece(piece, row, col) {
        if (piece === "empty") {
            return null;
        }

        let pieceClass = `piece ${piece}`;

        if (isSquareSelected(selectedPiece, row, col)) {
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
            <div className="game-content">
                <div className="game-screen">
                    <div className="board-area">
                        <section className="top-game-bar">
                            <div className="turn-pill">
                                Player <strong>{playerScore}</strong> :{" "}
                                <strong>{computerScore}</strong> Computer
                            </div>

                            <div className="piece-count">
                                <strong>{countPieces(game, "white")}</strong> white ·{" "}
                                <strong>{countPieces(game, "black")}</strong> black
                            </div>

                            <div className="custom-difficulty">
                                <button
                                    className="difficulty-select"
                                    onClick={toggleDifficultyDropdown}
                                >
                                    <span>
                                        {botDifficulty === null
                                            ? "Medium"
                                            : capitalizeDifficulty(botDifficulty)}
                                    </span>
                                </button>

                                {difficultyDropdownOpen && (
                                    <div className="difficulty-options">
                                        <button
                                            className={`difficulty-option ${botDifficulty === "easy" ? "active" : ""}`}
                                            onClick={() => selectDifficulty("easy")}
                                        >
                                            Easy
                                        </button>

                                        <button
                                            className={`difficulty-option ${botDifficulty === "medium" ? "active" : ""}`}
                                            onClick={() => selectDifficulty("medium")}
                                        >
                                            Medium
                                        </button>

                                        <button
                                            className={`difficulty-option ${botDifficulty === "hard" ? "active" : ""}`}
                                            onClick={() => selectDifficulty("hard")}
                                        >
                                            Hard
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="board-section">
                            <div className="board">
                                {game.board.map((row, rowIndex) =>
                                    row.map((piece, colIndex) => {
                                        const possibleMove = getMoveForSquare(
                                            possibleMoves,
                                            rowIndex,
                                            colIndex
                                        );

                                        const squareClass = getSquareClassName(
                                            rowIndex,
                                            colIndex,
                                            possibleMove
                                        );

                                        return (
                                            <div
                                                key={`${rowIndex}-${colIndex}`}
                                                className={squareClass}
                                                onClick={() =>
                                                    handleSquareClick(rowIndex, colIndex)
                                                }
                                            >
                                                {renderPiece(piece, rowIndex, colIndex)}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <p className="move-label">
                                {game.current_player === "white"
                                    ? "Your move (White)"
                                    : "Computer's move (Black)"}
                            </p>

                            <div className="game-buttons">
                                <button
                                    className="main-action-button"
                                    onClick={() => startNewGame(botDifficulty || "easy")}
                                >
                                    New game
                                </button>

                                <button className="secondary-action-button" disabled>
                                    Offer draw
                                </button>

                                <button
                                    className="secondary-action-button"
                                    onClick={getHint}
                                >
                                    Hint
                                </button>
                            </div>
                        </section>
                    </div>

                    <section className="coach-panel">
                        <div className="coach-header">
                            <h2>✣ AI Coach</h2>
                            <span>Hints for the current board</span>
                        </div>

                        <button
                            className="coach-question"
                            onClick={getHint}
                        >
                            Give me a quick hint for my best move right now.
                        </button>

                        {hint && (
                            <div className="hint-box">
                                <p>{hint}</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        );
    }

    return (
        <main className="app">
            <h1>AI Checkers Coach</h1>

            {renderGame()}
        </main>
    );
}

export default App;