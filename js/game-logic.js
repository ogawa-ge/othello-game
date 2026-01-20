// ゲームのコアロジック（盤面管理、ルール判定など）をここに記述します
const GameLogic = {
    // ... (createBoard, initBoard, _getFlippablePiecesInDirection, isValidMove, getValidMoves, placeAndFlip は省略)
    createBoard: () => Array(8).fill(null).map(() => Array(8).fill(0)),
    initBoard: (board) => {
        board[3][3] = -1; board[3][4] = 1;
        board[4][3] = 1;  board[4][4] = -1;
        return board;
    },
    _getFlippablePiecesInDirection: (board, row, col, dr, dc, player) => {
        const opponent = -player;
        const piecesToFlip = [];
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
            piecesToFlip.push([r, c]);
            r += dr; c += dc;
        }
        if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === player) {
            return piecesToFlip;
        }
        return [];
    },
    isValidMove: (board, row, col, player) => {
        if (board[row][col] !== 0) return false;
        const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (const [dr, dc] of directions) {
            if (GameLogic._getFlippablePiecesInDirection(board, row, col, dr, dc, player).length > 0) return true;
        }
        return false;
    },
    getValidMoves: (board, player) => {
        const validMoves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (GameLogic.isValidMove(board, r, c, player)) validMoves.push([r, c]);
            }
        }
        return validMoves;
    },
    placeAndFlip: (board, row, col, player) => {
        if (!GameLogic.isValidMove(board, row, col, player)) return false;
        const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        let piecesFlipped = 0;
        for (const [dr, dc] of directions) {
            const piecesToFlip = GameLogic._getFlippablePiecesInDirection(board, row, col, dr, dc, player);
            if (piecesToFlip.length > 0) {
                piecesToFlip.forEach(([r, c]) => { board[r][c] = player; piecesFlipped++; });
            }
        }
        board[row][col] = player;
        return piecesFlipped > 0;
    },

    // ゲームが終了したかどうかを判定する
    isGameOver: (board) => {
        const blackHasMoves = GameLogic.getValidMoves(board, 1).length > 0;
        const whiteHasMoves = GameLogic.getValidMoves(board, -1).length > 0;
        return !blackHasMoves && !whiteHasMoves;
    },

    // 勝者を判定する
    getWinner: (board) => {
        let blackScore = 0;
        let whiteScore = 0;
        board.forEach(row => {
            row.forEach(cell => {
                if (cell === 1) blackScore++;
                if (cell === -1) whiteScore++;
            });
        });

        if (blackScore > whiteScore) return 1;  // 黒の勝ち
        if (whiteScore > blackScore) return -1; // 白の勝ち
        return 0; // 引き分け
    }
};

console.log("game-logic.js loaded");
