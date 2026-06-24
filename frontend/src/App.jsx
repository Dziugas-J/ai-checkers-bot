import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function newGame() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/game/new`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to create new game");
            }

            const data = await response.json();
            setGame(data);
        } 
        catch (err) {
            setError(err.message);
        } 
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        newGame();
    }, []);

    function renderPiece(piece) {
        if (piece === "empty") {
            return null;
        }

        return <div className={`piece ${piece}`}></div>;
    }

    return (
        <main className="app">
            <h1>AI Checkers Coach</h1>

            <button onClick={newGame} disabled={loading}>
                {loading ? "Loading..." : "New Game"}
            </button>

            {error && <p className="error">{error}</p>}

            {game && (
                <section className="game-info">
                    <p>
                        <strong>Current player:</strong> {game.current_player}
                    </p>
                    <div className="board">
                        {game.board.map((row, rowIndex) =>
                            row.map((piece, colIndex) => {
                                const isDarkSquare = (rowIndex + colIndex) % 2 === 1;

                                return (
                                    <div key={`${rowIndex}-${colIndex}`} className={`square ${isDarkSquare ? "dark" : "light"}`}>
                                        {renderPiece(piece)}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            )}
        </main>
    );
}

export default App;