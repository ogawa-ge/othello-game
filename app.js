// アプリケーションのメインロジックをここに記述します
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const game = {
        board: null,
        currentPlayer: 1, // 1 for Black, -1 for White
        mode: 'pva', // 'pvp' or 'pva'
        aiDifficulty: 'medium',
        isGameOver: false,
    };

    function handlePlayerMove(row, col) {
        if (game.isGameOver || (game.mode === 'pva' && game.currentPlayer === -1)) {
            return; // Not player's turn or game is over
        }

        const validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        const isValid = validMoves.some(move => move[0] === row && move[1] === col);

        if (isValid) {
            GameLogic.placeAndFlip(game.board, row, col, game.currentPlayer);
            handleTurn();
        } else {
            console.log("Invalid move.");
        }
    }

    function handleTurn() {
        if (checkGameOver()) return;
        
        // Switch player
        game.currentPlayer *= -1;
        UI.updateCurrentPlayer(game.currentPlayer);

        let validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        UI.renderBoard(game.board, validMoves); // Pass valid moves to UI.renderBoard

        if (validMoves.length === 0) {
            console.log(`${game.currentPlayer === 1 ? '黒' : '白'} has no valid moves. Passing turn.`);
            // Pass the turn back
            game.currentPlayer *= -1;
            UI.updateCurrentPlayer(game.currentPlayer);
            
            if (checkGameOver()) return;
        }

        // If it's AI's turn
        if (game.mode === 'pva' && game.currentPlayer === -1) {
            // Disable clicks and trigger AI move after a short delay
            setTimeout(triggerAIMove, 500);
        }
    }
    
    function triggerAIMove() {
        console.log("AI is thinking...");
        const aiMove = AILogic.makeMove(game.board, game.currentPlayer, game.aiDifficulty);

        if(aiMove) {
            const [row, col] = aiMove;
            GameLogic.placeAndFlip(game.board, row, col, game.currentPlayer);
        } else {
            console.log("AI has no moves.");
        }
        
        // After AI makes a move, re-render with the valid moves for the *next* player
        handleTurn();
    }

    function checkGameOver() {
        if (GameLogic.isGameOver(game.board)) {
            game.isGameOver = true;
            const winner = GameLogic.getWinner(game.board);
            UI.displayWinner(winner);
            console.log("Game Over.");
            return true;
        }
        return false;
    }

    function initGame(event) {
        if(event) event.preventDefault(); // Prevent form submission

        game.mode = document.getElementById('game-mode').value;
        game.aiDifficulty = document.getElementById('ai-difficulty').value;
        
        document.getElementById('ai-difficulty-selection').style.display = game.mode === 'pva' ? 'block' : 'none';

        game.board = GameLogic.createBoard();
        GameLogic.initBoard(game.board);
        game.currentPlayer = 1;
        game.isGameOver = false;

        const validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        UI.renderBoard(game.board, validMoves); // Pass valid moves on initial render
        UI.updateScore(game.board);
        UI.updateCurrentPlayer(game.currentPlayer);
        document.getElementById('game-result').textContent = '';
        
        console.log(`New game started. Mode: ${game.mode}, Difficulty: ${game.aiDifficulty}`);
    }

    // --- Event Listeners ---
    document.getElementById('game-setup').addEventListener('submit', initGame);
    document.getElementById('game-mode').addEventListener('change', () => {
        const isPVA = document.getElementById('game-mode').value === 'pva';
        document.getElementById('ai-difficulty-selection').style.display = isPVA ? 'block' : 'none';
    });
    document.getElementById('board-container').addEventListener('click', (event) => {
        const cell = event.target.closest('.cell');
        if (cell) {
            const row = parseInt(cell.dataset.row, 10);
            const col = parseInt(cell.dataset.col, 10);
            handlePlayerMove(row, col);
        }
    });

    // --- Initial Game Start ---
    initGame();
});

console.log("app.js loaded");
