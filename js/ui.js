const UI = {
    renderBoard: (board, validMoves = []) => { // 有効な手を表示するための引数を追加
        const boardContainer = document.getElementById('board-container');
        boardContainer.innerHTML = ''; // レンダリング前にボードをクリア

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;

                // このセルが有効な手かどうかをチェック
                const isValidMoveCell = validMoves.some(move => move[0] === r && move[1] === c);
                if (isValidMoveCell) {
                    cell.classList.add('valid-move');
                }

                const pieceValue = board[r][c];
                if (pieceValue !== 0) {
                    const piece = document.createElement('div');
                    piece.className = 'piece ' + (pieceValue === 1 ? 'black' : 'white');
                    cell.appendChild(piece);
                }
                
                boardContainer.appendChild(cell);
            }
        }
    },

    updateScore: (board) => {
        let blackScore = 0;
        let whiteScore = 0;
        board.forEach(row => {
            row.forEach(cell => {
                if (cell === 1) blackScore++;
                if (cell === -1) whiteScore++;
            });
        });
        document.getElementById('black-score').textContent = blackScore;
        document.getElementById('white-score').textContent = whiteScore;
    },

    updateCurrentPlayer: (player) => {
        document.getElementById('current-player').textContent = player === 1 ? '黒' : '白';
    },

    displayWinner: (winner) => {
        const resultDiv = document.getElementById('game-result');
        if (winner === 0) {
            resultDiv.textContent = '引き分けです！';
        } else {
            resultDiv.textContent = `${winner === 1 ? '黒' : '白'}の勝ちです！`;
        }
    }
};

console.log("ui.js が読み込まれました");