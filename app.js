// アプリケーションのメインロジックをここに記述します
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMの読み込みと解析が完了しました");

    const socket = io(); // サーバーに接続

    const game = {
        board: null,
        currentPlayer: 1, // 1が黒、-1が白
        mode: 'pva', // 'pvp', 'pva', 'online'
        aiDifficulty: 'medium',
        myColor: 0, // オンライン対戦時の自分の色(1:黒, -1:白)
        roomId: null, // オンライン対戦のルームID
        isGameOver: false,
    };

    // --- Socket.IO イベントハンドラ ---

    socket.on('message', (data) => {
        document.getElementById('game-result').textContent = data.text;
        console.log(`Message from server: ${data.text}`);
    });

    socket.on('game_start', (data) => {
        console.log('Game start!', data);
        game.myColor = data.color;
        game.roomId = data.roomId;
        game.mode = 'online';

        document.getElementById('game-setup').style.display = 'none';
        document.getElementById('game-info').style.display = 'block';

        game.board = GameLogic.createBoard();
        GameLogic.initBoard(game.board);
        game.currentPlayer = 1;
        game.isGameOver = false;

        const validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        UI.renderBoard(game.board, validMoves);
        UI.updateScore(game.board);
        UI.updateCurrentPlayer(game.currentPlayer);
        
        const yourColor = game.myColor === 1 ? '黒' : '白';
        document.getElementById('game-result').textContent = `対戦開始！あなたは ${yourColor} です。`;
    });

    socket.on('update_game', (data) => {
        game.board = data.board;
        game.currentPlayer = data.currentPlayer;
        
        const validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        UI.renderBoard(game.board, validMoves);
        UI.updateScore(game.board);
        UI.updateCurrentPlayer(game.currentPlayer);
    });

    socket.on('game_over', (data) => {
        game.isGameOver = true;
        UI.displayWinner(data.winner);
        console.log("Game Over.");
    });

    socket.on('opponent_disconnected', (data) => {
        game.isGameOver = true;
        document.getElementById('game-result').textContent = data.message;
    });


    function handlePlayerMove(row, col) {
        if (game.isGameOver) return;

        if (game.mode === 'online' && game.myColor !== game.currentPlayer) {
            console.log("相手のターンです。");
            return;
        }
        
        if (game.mode === 'pva' && game.currentPlayer === -1) {
            return;
        }

        const validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        const isValid = validMoves.some(move => move[0] === row && move[1] === col);

        if (isValid) {
            if (game.mode === 'online') {
                socket.emit('place_stone', { row, col, roomId: game.roomId });
            } else {
                GameLogic.placeAndFlip(game.board, row, col, game.currentPlayer);
                handleTurn();
            }
        } else {
            console.log("無効な手です。");
        }
    }

    function handleTurn() {
        if (checkGameOver()) return;
        
        game.currentPlayer *= -1;
        UI.updateCurrentPlayer(game.currentPlayer);

        let validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        UI.renderBoard(game.board, validMoves);
        UI.updateScore(game.board);

        if (validMoves.length === 0) {
            console.log(`${game.currentPlayer === 1 ? '黒' : '白'}には有効な手がありません。パスします。`);
            game.currentPlayer *= -1;
            UI.updateCurrentPlayer(game.currentPlayer);
            
            if (checkGameOver()) return;
        }

        if (game.mode === 'pva' && game.currentPlayer === -1) {
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
        if(event) event.preventDefault();

        game.mode = document.getElementById('game-mode').value;
        if (game.mode === 'online') return;

        game.aiDifficulty = document.getElementById('ai-difficulty').value;
        
        document.getElementById('ai-difficulty-selection').style.display = game.mode === 'pva' ? 'block' : 'none';
        document.getElementById('game-info').style.display = 'block';

        game.board = GameLogic.createBoard();
        GameLogic.initBoard(game.board);
        game.currentPlayer = 1;
        game.isGameOver = false;

        const validMoves = GameLogic.getValidMoves(game.board, game.currentPlayer);
        UI.renderBoard(game.board, validMoves);
        UI.updateScore(game.board);
        UI.updateCurrentPlayer(game.currentPlayer);
        document.getElementById('game-result').textContent = '';
        
        console.log(`新しいゲームを開始しました。モード: ${game.mode}, 難易度: ${game.aiDifficulty}`);
    }

    document.getElementById('game-setup').addEventListener('submit', initGame);
    document.getElementById('game-mode').addEventListener('change', () => {
        const mode = document.getElementById('game-mode').value;
        if(mode === 'online') {
            document.getElementById('game-setup').style.display = 'none';
            socket.emit('find_game'); // find_gameイベントは未実装だが、将来的にはこうなる
            document.getElementById('game-result').textContent = 'オンライン対戦を探しています...';
        } else {
            document.getElementById('ai-difficulty-selection').style.display = mode === 'pva' ? 'block' : 'none';
        }
    });
    document.getElementById('board-container').addEventListener('click', (event) => {
        const cell = event.target.closest('.cell');
        if (cell) {
            const row = parseInt(cell.dataset.row, 10);
            const col = parseInt(cell.dataset.col, 10);
            handlePlayerMove(row, col);
        }
    });
    
    document.getElementById('game-info').style.display = 'none';
});

console.log("app.jsが読み込まれました");
