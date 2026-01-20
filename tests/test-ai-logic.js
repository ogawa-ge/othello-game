// AIロジックのテストをここに記述します
QUnit.module('AI Logic', function(hooks) {
    let board;

    hooks.beforeEach(function() {
        board = GameLogic.createBoard();
        GameLogic.initBoard(board);
    });

    QUnit.test('T020 - Easy AI returns a valid move', function(assert) {
        const player = 1; // Black
        const validMoves = GameLogic.getValidMoves(board, player);
        const aiMove = AILogic.makeMove(board, player, 'easy');

        assert.ok(aiMove, 'Easy AI should return a move');
        
        const isMoveValid = validMoves.some(move => move[0] === aiMove[0] && move[1] === aiMove[1]);
        assert.ok(isMoveValid, 'Easy AI should return a move from the valid moves list');
    });

    QUnit.test('T021 - Medium AI makes a predictable smart move', function(assert) {
        const player = 1; // Black
        // Setup a board where a corner is available
        board[0][0] = 0; // Make corner available
        board[1][1] = 1;
        board[0][1] = -1;

        const validMoves = GameLogic.getValidMoves(board, player);
        // Ensure the corner is actually a valid move
        const isCornerValid = validMoves.some(move => move[0] === 0 && move[1] === 0);
        assert.ok(isCornerValid, 'The corner [0,0] should be a valid move for the test setup');

        const aiMove = AILogic.makeMove(board, player, 'medium');

        assert.deepEqual(aiMove, [0, 0], 'Medium AI should choose the corner');
    });

    QUnit.test('T021 - Hard AI returns a valid move', function(assert) {
        const player = -1; // White
        const validMoves = GameLogic.getValidMoves(board, player);
        const aiMove = AILogic.makeMove(board, player, 'hard');

        assert.ok(aiMove, 'Hard AI should return a move');
        
        const isMoveValid = validMoves.some(move => move[0] === aiMove[0] && move[1] === aiMove[1]);
        assert.ok(isMoveValid, 'Hard AI should return a move from the valid moves list');
    });
});
