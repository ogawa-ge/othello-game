// AIロジックのテスト
QUnit.module('AIロジック', function(hooks) {
    let board;

    hooks.beforeEach(function() {
        board = GameLogic.createBoard();
        GameLogic.initBoard(board);
    });

    QUnit.test('T020 - 弱いAIは有効な手を返す', function(assert) {
        const player = 1; // 黒
        const validMoves = GameLogic.getValidMoves(board, player);
        const aiMove = AILogic.makeMove(board, player, 'easy');

        assert.ok(aiMove, '弱いAIは手を返す必要があります');
        
        const isMoveValid = validMoves.some(move => move[0] === aiMove[0] && move[1] === aiMove[1]);
        assert.ok(isMoveValid, '弱いAIは有効な手のリストから手を返す必要があります');
    });

    QUnit.test('T021 - 普通のAIは予測可能な賢い手を打つ', function(assert) {
        const player = 1; // 黒
        // 角が利用可能な盤面を設定
        board[0][0] = 0; // 角を有効にする
        board[1][1] = 1;
        board[0][1] = -1;

        const validMoves = GameLogic.getValidMoves(board, player);
        // 角が実際に有効な手であることを確認
        const isCornerValid = validMoves.some(move => move[0] === 0 && move[1] === 0);
        assert.ok(isCornerValid, 'テスト設定では角[0,0]が有効な手である必要があります');

        const aiMove = AILogic.makeMove(board, player, 'medium');

        assert.deepEqual(aiMove, [0, 0], '普通のAIは角を選択する必要があります');
    });

    QUnit.test('T021 - 強いAIは有効な手を返す', function(assert) {
        const player = -1; // 白
        const validMoves = GameLogic.getValidMoves(board, player);
        const aiMove = AILogic.makeMove(board, player, 'hard');

        assert.ok(aiMove, '強いAIは手を返す必要があります');
        
        const isMoveValid = validMoves.some(move => move[0] === aiMove[0] && move[1] === aiMove[1]);
        assert.ok(isMoveValid, '強いAIは有効な手のリストから手を返す必要があります');
    });
});