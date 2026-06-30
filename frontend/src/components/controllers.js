import { useEffect, useState } from "react";
import { fetchNewGame, fetchLegalMoves, sendMove, sendBotMove } from "../Api";
import {
    getMoveForSquare,
    isPossibleMoveSquare,
    isSquareSelected,
    waitHalfSecond,
} from "./helpers";

function controllers() {
    const [game, setGame] = useState(null);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [botDifficulty, setBotDifficulty] = useState("easy");
    const [hint, setHint] = useState("");
    const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [scoredWinner, setScoredWinner] = useState(null);

    async function loadPreviewGame() {
        const data = await fetchNewGame();
        setGame(data);
    }

    async function startNewGame(difficulty) {
        setSelectedPiece(null);
        setPossibleMoves([]);
        setHint("");
        setBotDifficulty(difficulty);
        setScoredWinner(null);

        const data = await fetchNewGame();
        setGame(data);

        setPlayerScore(0);
        setComputerScore(0);
    }

    useEffect(() => {
        loadPreviewGame();
    }, []);

    useEffect(() => {
        if (!game || !game.winner) {
            return;
        }

        if (scoredWinner === game.winner) {
            return;
        }

        setScoredWinner(game.winner);

        if (game.winner === "white") {
            setPlayerScore((currentScore) => currentScore + 1);
        }

        if (game.winner === "black") {
            setComputerScore((currentScore) => currentScore + 1);
        }

        resetBoardAfterPoint();
    }, [game]);

    function getHint() {
        setHint(
            "Since this is the current position, look for forced captures first. If no capture is available, try to move toward the center while keeping your back row protected."
        );
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
        const selectedMove = getMoveForSquare(
            possibleMoves,
            targetRow,
            targetCol
        );

        if (!game || !selectedPiece || !selectedMove) {
            return;
        }

        const moveStartRow = selectedPiece.row;
        const moveStartCol = selectedPiece.col;

        clearSelectedPiece();

        const updatedGame = await sendMove(
            game,
            moveStartRow,
            moveStartCol,
            targetRow,
            targetCol
        );

        setGame(updatedGame);

        if (updatedGame.winner) {
            clearSelectedPiece();
            return;
        }

        if (updatedGame.must_continue_capture && updatedGame.forced_piece) {
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

        if (updatedGame.current_player === "black") {
            await waitHalfSecond();

            const gameAfterBotMove = await sendBotMove(
                updatedGame,
                botDifficulty
            );

            setGame(gameAfterBotMove);
            clearSelectedPiece();
            return;
        }
    }

    async function handleSquareClick(row, col) {
        if (!game) {
            return;
        }

        if (game.current_player === "black") {
            return;
        }

        if (isPossibleMoveSquare(possibleMoves, row, col)) {
            await applySelectedMove(row, col);
            return;
        }

        const piece = game.board[row][col];

        if (piece === "empty") {
            clearSelectedPiece();
            return;
        }

        if (isSquareSelected(selectedPiece, row, col)) {
            clearSelectedPiece();
            return;
        }

        await selectPieceAndLoadMoves(row, col);
    }

    function toggleDifficultyDropdown() {
        setDifficultyDropdownOpen(!difficultyDropdownOpen);
    }

    async function selectDifficulty(newDifficulty) {
        setDifficultyDropdownOpen(false);

        if (newDifficulty === botDifficulty) {
            return;
        }

        await startNewGame(newDifficulty);
    }

    async function resetBoardAfterPoint() {
        await waitHalfSecond();

        const newGame = await fetchNewGame();

        setGame(newGame);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setHint("");
        setScoredWinner(null);
    }

    return {
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
    };
}

export default controllers;