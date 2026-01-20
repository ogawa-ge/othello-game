// ゲームロジックのテストをここに記述します
QUnit.module('Game Logic', function(hooks) {
    let board;

    // 各テストの前に、新しいボードで初期化する
    hooks.beforeEach(function() {
        board = GameLogic.createBoard();
        GameLogic.initBoard(board);
    });

    QUnit.test('T008 - Board Initialization', function(assert) {
        // 盤面が8x8であることを確認
        assert.equal(board.length, 8, 'Board should have 8 rows');
        assert.equal(board[0].length, 8, 'Board should have 8 columns');
        
        // 中央の駒が正しく配置されているかを確認
        assert.equal(board[3][3], -1, 'Center piece at [3][3] should be White');
        assert.equal(board[3][4], 1, 'Center piece at [3][4] should be Black');
        assert.equal(board[4][3], 1, 'Center piece at [4][3] should be Black');
        assert.equal(board[4][4], -1, 'Center piece at [4][4] should be White');
    });

    QUnit.test('T009 - Valid Moves Calculation', function(assert) {
        // 黒のターン (player 1) の有効な手
        let validMoves = GameLogic.getValidMoves(board, 1);
        const expectedBlackMoves = [[2, 4], [3, 5], [5, 3], [4, 2]];
        // ソートして比較することで、順序の違いを無視する
        assert.deepEqual(validMoves.map(m => m.toString()).sort(), expectedBlackMoves.map(m => m.toString()).sort(), 'Initial valid moves for Black should be correct');

        // 白のターン (player -1) の有効な手
        let validMovesWhite = GameLogic.getValidMoves(board, -1);
        const expectedWhiteMoves = [[2, 3], [3, 2], [5, 4], [4, 5]];
        assert.deepEqual(validMovesWhite.map(m => m.toString()).sort(), expectedWhiteMoves.map(m => m.toString()).sort(), 'Initial valid moves for White should be correct');
    });

    QUnit.test('T010 - Place and Flip Logic', function(assert) {
        // 黒が (2, 4) に置くテスト
        const placed = GameLogic.placeAndFlip(board, 2, 4, 1);
        
        assert.ok(placed, 'placeAndFlip should return true for a valid move');
        assert.equal(board[2][4], 1, 'The piece should be placed at [2, 4]');
        assert.equal(board[3][4], 1, 'The piece at [3, 4] should be flipped to Black');

        // 無効な手 (0, 0) に置こうとするテスト
        const notPlaced = GameLogic.placeAndFlip(board, 0, 0, 1);
        assert.notOk(notPlaced, 'placeAndFlip should return false for an invalid move');
        assert.equal(board[0][0], 0, 'The piece should not be placed at [0, 0]');
    });

    QUnit.test('T011 - Pass Condition', function(assert) {
        // 白(W)がどこにも置けない盤面を作成
        // B B B
        // B W B
        // B B B
        const passBoard = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, -1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ];
        let whiteMoves = GameLogic.getValidMoves(passBoard, -1);
        assert.equal(whiteMoves.length, 0, 'White should have no valid moves');
        let blackMoves = GameLogic.getValidMoves(passBoard, 1);
        assert.ok(blackMoves.length > 0, 'Black should have valid moves');
    });

    QUnit.test('T012 - Game Over Condition', function(assert) {
        // 誰も置けない盤面（全面黒）
        const gameOverBoard = GameLogic.createBoard();
        for(let r=0; r<8; r++) {
            for(let c=0; c<8; c++) {
                gameOverBoard[r][c] = 1; // Fill with black pieces
            }
        }
        assert.ok(GameLogic.isGameOver(gameOverBoard), 'Game should be over when no player has valid moves');
        
        //
        assert.notOk(GameLogic.isGameOver(board), 'Game should not be over at the start');
    });

    QUnit.test('T013 - Winner Determination', function(assert) {
        // 黒が優勢な盤面
        board[0][0] = 1;
        assert.equal(GameLogic.getWinner(board), 1, 'Black should be the winner');

        // 白が優勢な盤面
        board[0][0] = -1;
        board[0][1] = -1;
        board[0][2] = -1;
        assert.equal(GameLogic.getWinner(board), -1, 'White should be the winner');

        // 引き分けの盤面
        const drawBoard = GameLogic.createBoard();
        for(let i=0; i<4; i++) {
            for(let j=0; j<8; j++) {
                drawBoard[i][j] = 1; // 32 black
                drawBoard[i+4][j] = -1; // 32 white
            }
        }
        assert.equal(GameLogic.getWinner(drawBoard), 0, 'Game should be a draw');
    });
});
