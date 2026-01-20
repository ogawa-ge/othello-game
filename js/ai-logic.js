const AILogic = {
    makeMove: (board, player, difficulty) => {
        const validMoves = GameLogic.getValidMoves(board, player);
        if (validMoves.length === 0) return null;

        switch (difficulty) {
            case 'easy':
                return AILogic._easyMove(validMoves);
            case 'medium':
                return AILogic._minimaxMove(board, player, 3, false);
            case 'hard':
                return AILogic._minimaxMove(board, player, 5, true);
            default:
                return AILogic._easyMove(validMoves);
        }
    },

    _easyMove: (validMoves) => {
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    },
    
    _minimaxMove: (board, player, depth, useAlphaBeta) => {
        let bestMove = null;
        let bestValue = -Infinity;
        let alpha = -Infinity;
        
        const validMoves = GameLogic.getValidMoves(board, player);
        if (validMoves.length === 0) return null;

        for (const move of validMoves) {
            const tempBoard = JSON.parse(JSON.stringify(board));
            GameLogic.placeAndFlip(tempBoard, move[0], move[1], player);
            
            let moveValue;
            if (useAlphaBeta) {
                moveValue = AILogic._minimaxAlphaBeta(tempBoard, depth - 1, alpha, Infinity, -player, player);
            } else {
                moveValue = AILogic._minimax(tempBoard, depth - 1, -player, player);
            }

            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = move;
            }
            if(useAlphaBeta) {
                alpha = Math.max(alpha, bestValue);
            }
        }
        return bestMove;
    },

    _minimax: (board, depth, currentPlayer, maximizingPlayer) => {
        if (depth === 0 || GameLogic.isGameOver(board)) {
            return AILogic._evaluateBoard(board, maximizingPlayer);
        }

        const validMoves = GameLogic.getValidMoves(board, currentPlayer);
        if (validMoves.length === 0) {
            return AILogic._minimax(board, depth - 1, -currentPlayer, maximizingPlayer);
        }
        
        let bestValue = (currentPlayer === maximizingPlayer) ? -Infinity : Infinity;

        for (const move of validMoves) {
            const tempBoard = JSON.parse(JSON.stringify(board));
            GameLogic.placeAndFlip(tempBoard, move[0], move[1], currentPlayer);
            const value = AILogic._minimax(tempBoard, depth - 1, -currentPlayer, maximizingPlayer);

            if (currentPlayer === maximizingPlayer) {
                bestValue = Math.max(bestValue, value);
            } else {
                bestValue = Math.min(bestValue, value);
            }
        }
        return bestValue;
    },

    _minimaxAlphaBeta: (board, depth, alpha, beta, currentPlayer, maximizingPlayer) => {
        if (depth === 0 || GameLogic.isGameOver(board)) {
            return AILogic._evaluateBoard(board, maximizingPlayer);
        }

        const validMoves = GameLogic.getValidMoves(board, currentPlayer);
        if (validMoves.length === 0) {
            return AILogic._minimaxAlphaBeta(board, depth - 1, alpha, beta, -currentPlayer, maximizingPlayer);
        }
        
        let bestValue = (currentPlayer === maximizingPlayer) ? -Infinity : Infinity;

        for (const move of validMoves) {
            const tempBoard = JSON.parse(JSON.stringify(board));
            GameLogic.placeAndFlip(tempBoard, move[0], move[1], currentPlayer);
            const value = AILogic._minimaxAlphaBeta(tempBoard, depth - 1, alpha, beta, -currentPlayer, maximizingPlayer);

            if (currentPlayer === maximizingPlayer) {
                bestValue = Math.max(bestValue, value);
                alpha = Math.max(alpha, bestValue);
                if (beta <= alpha) break; // Beta cutoff
            } else {
                bestValue = Math.min(bestValue, value);
                beta = Math.min(beta, bestValue);
                if (beta <= alpha) break; // Alpha cutoff
            }
        }
        return bestValue;
    },

    _evaluateBoard: (board, player) => {
        const weights = [
            [120, -20, 20,  5,  5, 20, -20, 120],
            [-20, -40, -5, -5, -5, -5, -40, -20],
            [ 20,  -5, 15,  3,  3, 15,  -5,  20],
            [  5,  -5,  3,  3,  3,  3,  -5,   5],
            [  5,  -5,  3,  3,  3,  3,  -5,   5],
            [ 20,  -5, 15,  3,  3, 15,  -5,  20],
            [-20, -40, -5, -5, -5, -5, -40, -20],
            [120, -20, 20,  5,  5, 20, -20, 120]
        ];
        
        let playerScore = 0;
        let opponentScore = 0;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] === player) {
                    playerScore += weights[r][c];
                } else if (board[r][c] === -player) {
                    opponentScore += weights[r][c];
                }
            }
        }
        return playerScore - opponentScore;
    }
};

console.log("ai-logic.js loaded");
