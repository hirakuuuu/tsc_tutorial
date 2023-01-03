import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";

import Main from "../pages/Main";
import Marubatsu from "../pages/marubatsu/Marubatsu";
import Othello from "../pages/othello/Othello";
import Yahtzee from "../pages/yahtzee/Yahtzee";
import YahtzeeLogin from "../pages/yahtzee_online/YahtzeeLogin";
import YahtzeeOnline from "../pages/yahtzee_online/YahtzeeOnline";
import YahtzeeWaiting from "../pages/yahtzee_online/YahtzeeWaiting";

const port = 5000;
const socket = io(`http://asobitai.onrender.com:${port}`);
// サーバに接続できた場合のイベント処理を定義する
socket.on("connect", () => {
  console.log(`socket.connectを出力`);
  console.log(socket.connect()); // サーバに接続できたかどうかを表示
});

const Router = () => {
  return (
    <Routes>
      <Route path={`/`} element={<Main />} />
      <Route path={`/marubatsu/`} element={<Marubatsu />} />
      <Route path={`/othello`} element={<Othello />} />
      <Route path={`/yahtzee`} element={<Yahtzee />} />
      <Route
        path={`/yahtzee_online/`}
        element={<YahtzeeLogin socket={socket} />}
      />
      <Route
        path={`/yahtzee_online/waiting/`}
        element={<YahtzeeWaiting socket={socket} />}
      />
      <Route
        path={`/yahtzee_online/main/`}
        element={<YahtzeeOnline socket={socket} />}
      />
    </Routes>
  );
};

export default Router;
