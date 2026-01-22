const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const GameLogic = require('./js/game-logic.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// 静的ファイル（HTML, CSS, JS）を配信
app.use(express.static(__dirname));

let waitingPlayer = null;
const rooms = {};

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket.id}`);

  if (waitingPlayer) {
    const player1 = { socket: waitingPlayer, color: 1 };
    const player2 = { socket: socket, color: -1 };
    
    const roomId = `${player1.socket.id}#${player2.socket.id}`;
    player1.socket.join(roomId);
    player2.socket.join(roomId);

    rooms[roomId] = {
      players: [player1, player2],
      board: GameLogic.initBoard(GameLogic.createBoard()),
      currentPlayer: 1,
    };

    console.log(`matching complete: ${player1.socket.id} vs ${player2.socket.id} in room ${roomId}`);
    
    player1.socket.emit('game_start', { color: 1, roomId: roomId });
    player2.socket.emit('game_start', { color: -1, roomId: roomId });

    waitingPlayer = null;
  } else {
    waitingPlayer = socket;
    console.log(`player waiting: ${socket.id}`);
    waitingPlayer.emit('message', { text: '対戦相手を待っています...' });
  }

  socket.on('place_stone', (data) => {
    const { row, col, roomId } = data;
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p => p.socket.id === socket.id);
    if (!player || player.color !== room.currentPlayer) {
      console.log("Invalid turn or player");
      return;
    }

    if (GameLogic.isValidMove(room.board, row, col, room.currentPlayer)) {
      GameLogic.placeAndFlip(room.board, row, col, room.currentPlayer);
      
      let nextPlayer = -room.currentPlayer;
      // パスをチェック
      if(GameLogic.getValidMoves(room.board, nextPlayer).length === 0) {
        if(GameLogic.getValidMoves(room.board, room.currentPlayer).length > 0) {
            console.log(`Player ${nextPlayer} has no moves, passing turn back.`);
            nextPlayer = room.currentPlayer; // ターンを戻す
        } else {
            // 両者置けないのでゲーム終了
            console.log("Game over");
            io.to(roomId).emit('game_over', { winner: GameLogic.getWinner(room.board) });
            delete rooms[roomId];
            return;
        }
      }
      room.currentPlayer = nextPlayer;

      io.to(roomId).emit('update_game', {
        board: room.board,
        currentPlayer: room.currentPlayer
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`);
    if (socket === waitingPlayer) {
      waitingPlayer = null;
      console.log('waiting player disconnected.');
    } else {
        // 対戦中のプレイヤーが切断した場合の処理
        Object.keys(rooms).forEach(roomId => {
            const room = rooms[roomId];
            const playerInRoom = room.players.find(p => p.socket.id === socket.id);
            if(playerInRoom) {
                const opponent = room.players.find(p => p.socket.id !== socket.id);
                if(opponent) {
                    opponent.socket.emit('opponent_disconnected', { message: "対戦相手の接続が切れました。" });
                }
                delete rooms[roomId];
            }
        });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
