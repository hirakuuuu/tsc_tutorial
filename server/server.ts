import http from "http";
import express from "express";
import socketio from "socket.io";

const app: express.Express = express();
const server: http.Server = http.createServer(app);

app.get("/", (req, res) => {
  res.status(200).send("OK!");
});

const io: socketio.Server = new socketio.Server(server, {
  cors: {
    // Server作成時の引数にCORSオプションを追加する
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 待機ユーザのキュー
let waitingClients: string[] = [];
// ルームの人数
let numClients: { [key: string]: number } = {};
// ルームの最大人数
const maxRoomNum = 2;
// ユーザの入室状況
let isConnected: { [key: string]: string } = {};
// 対戦時に渡すユーザの情報
let player1Name: string;
let player2Name: string;
let firstPlayer: string;

// IDの生成に使う文字
const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// IDを生成する関数
const generateRoomId = (N: number): string => {
  return Array.from(Array(N))
    .map(() => S[Math.floor(Math.random() * S.length)])
    .join("");
};

io.on("connection", (socket: socketio.Socket) => {
  // ブラウザから接続されたときの処理
  const socketId = socket.id;
  console.log(`[connect] socketId: ${socketId}`);

  socket.on("disconnect", () => {
    // ブラウザが切断したときの処理
    console.log(`[disconnect] ${clientId}`);

    // 待機中に切断された→キューから削除
    let deleteId = waitingClients.findIndex((id) => id === clientId);
    if (deleteId !== -1) {
      waitingClients.splice(deleteId, 1);
    }

    // 対戦中に切断された→ユーザの接続状態をリセット
    if (isConnected[clientId] !== undefined && isConnected[clientId] !== "") {
      io.to(isConnected[clientId]).emit("OPPONENT_DISCONNECTED");
      numClients[isConnected[clientId]]--;
      isConnected[clientId] = "";
    }
  });

  // ルームから退出する時の処理
  socket.on("ROOM_LEAVING", (data) => {
    console.log(`[disconnect] ${data.clientId}`);
    isConnected[data.clientId] = "";
  });

  // ユーザの情報
  let clientId = "";
  let roomId = "";

  // Clientが待機状態にいることを確認
  socket.on("WAITING_LOGIN", (data) => {
    waitingClients.push(data.clientId);
    clientId = data.clientId;
    console.log(`current waiting clients: ${waitingClients.length}`);

    if (waitingClients.length >= 2) {
      let player1 = waitingClients[0];
      let player2 = waitingClients[1];
      waitingClients.splice(0, 2);
      roomId = generateRoomId(32);
      socket.join(roomId);
      io.emit("JOIN_ROOM", {
        roomId,
        player1,
        player2,
      });
    }
  });

  // Clientが入室できることを確認
  socket.on(
    "ACCEPT_JOIN_ROOM",
    (data: { roomId: string; clientId: string; name: string }) => {
      if (
        isConnected[data.clientId] === undefined ||
        isConnected[data.clientId] === ""
      ) {
        isConnected[data.clientId] = data.roomId;
        if (numClients[data.roomId] === undefined) {
          numClients[data.roomId] = 0;
        }

        if (numClients[data.roomId] < maxRoomNum) {
          socket.join(data.roomId);
          console.log(
            `[join room] client:${data.name}, id:${data.clientId} in room:${data.roomId}`
          );
          if (numClients[data.roomId] === 0) {
            player1Name = data.name;
            firstPlayer = data.clientId;
          } else {
            player2Name = data.name;
          }
          numClients[data.roomId]++;
          if (numClients[data.roomId] === maxRoomNum) {
            io.to(data.roomId).emit("YAHTZEE_LOGIN", {
              roomId: data.roomId,
              player1: player1Name,
              player2: player2Name,
              firstPlayer,
            });
          }
        } else {
          console.log(`${data.roomId}は満室です.`);
        }
      } else {
        console.log("すでに入室済みです");
      }
    }
  );

  // Clientからステートを受信
  socket.on("YAHTZEE_CHANGE_TURN_FROM", (data) => {
    // Clientにステートを送信
    io.to(data.roomId).emit("YAHTZEE_CHANGE_TURN_TO", data.state);
  });

  // Clientからさいころのキープの状態を受信
  socket.on("YAHTZEE_CHANGE_KEEP_FROM", (data) => {
    // Clientにさいころのキープの状態を送信
    io.to(data.roomId).emit("YAHTZEE_CHANGE_KEEP_TO", data.dices);
  });

  // Clientからさいころの回転を受信
  socket.on("YAHTZEE_CHANGE_DICE_FROM", (data) => {
    // Clientにさいころの回転を送信
    io.to(data.roomId).emit("YAHTZEE_CHANGE_DICE_TO", {
      dices: data.dices,
      rotateNumber: data.rotateNumber,
    });
  });

  // Clientからスコアの変更を受信
  socket.on("YAHTZEE_CHANGE_SCORE_FROM", (data) => {
    // Clientからスコアの変更を送信
    io.to(data.roomId).emit("YAHTZEE_CHANGE_SCORE_TO", data.scores);
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
