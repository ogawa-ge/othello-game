// アプリケーションのメインロジックをここに記述します
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMの読み込みと解析が完了しました");

    const game = {
        board: null,
        currentPlayer: 1, // 1が黒、-1が白
        mode: 'pva', // 'pvp' (対人戦) or 'pva' (対AI戦)
        aiDifficulty: 'medium',
        isGameOver: false,
    };

    function handlePlayerMove(row, col) {
        if (game.isGameOver || (game.mode === 'pva' && game.currentPlayer === -1)) {
            return; // プレイヤーのターンではない、またはゲームが終了している
        }

        const validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        const isValid = validMoves.some(move => move[0] === row && move[1] === col);

        if (isValid) {
            GameLogic.placeAndFlip(game.board, row, col, game.currentPlayer);
            handleTurn();
        } else {
            console.log("無効な手です。");
        }
    }

    function handleTurn() {
        if (checkGameOver()) return;
        
        // プレイヤーを交代
        game.currentPlayer *= -1;
        UI.updateCurrentPlayer(game.currentPlayer);

        let validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        UI.renderBoard(game.board, validMoves); // 有効な手をUI.renderBoardに渡す

        if (validMoves.length === 0) {
            console.log(`${game.currentPlayer === 1 ? '黒' : '白'}には有効な手がありません。パスします。`);
            // ターンを戻す
            game.currentPlayer *= -1;
            UI.updateCurrentPlayer(game.currentPlayer);
            
            if (checkGameOver()) return;
        }

        // AIのターンの場合
        if (game.mode === 'pva' && game.currentPlayer === -1) {
            // クリックを無効にし、少し遅れてAIの手をトリガーする
            setTimeout(triggerAIMove, 500);
        }
    }
    
    function triggerAIMove() {
        console.log("AIが思考中です...");
        const aiMove = AILogic.makeMove(game.board, game.currentPlayer, game.aiDifficulty);

        if(aiMove) {
            const [row, col] = aiMove;
            GameLogic.placeAndFlip(game.board, row, col, game.currentPlayer);
        } else {
            console.log("AIには打つ手がありません。");
        }
        
        // AIが手を打った後、次のプレイヤーの有効な手で再描画する
        handleTurn();
    }

    function checkGameOver() {
        if (GameLogic.isGameOver(game.board)) {
            game.isGameOver = true;
            const winner = GameLogic.getWinner(game.board);
            UI.displayWinner(winner);
            console.log("ゲームオーバー。");
            return true;
        }
        return false;
    }

    function initGame(event) {
        if(event) event.preventDefault(); // フォームの送信を抑制

        game.mode = document.getElementById('game-mode').value;
        game.aiDifficulty = document.getElementById('ai-difficulty').value;
        
        document.getElementById('ai-difficulty-selection').style.display = game.mode === 'pva' ? 'block' : 'none';

        game.board = GameLogic.createBoard();
        GameLogic.initBoard(game.board);
        game.currentPlayer = 1;
        game.isGameOver = false;

        const validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        UI.renderBoard(game.board, validMoves); // 初回描画時に有効な手を渡す
        UI.updateScore(game.board);
        UI.updateCurrentPlayer(game.currentPlayer);
        document.getElementById('game-result').textContent = '';
        
        console.log(`新しいゲームを開始しました。モード: ${game.mode}, 難易度: ${game.aiDifficulty}`);
    }

    // --- イベントリスナー ---
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

    // --- ゲームの初期化 ---
    initGame();
});

console.log("app.jsが読み込まれました");
