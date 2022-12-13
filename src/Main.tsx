import React from "react";
import LinkButton from "./components/LinkButton";

import "./style/Main.css";

const Main = () => {
  return (
    <div>
      <h1>目標51個</h1>
      <div className="game-button">
        <LinkButton to={"/marubatsu"} title={"〇☓ゲーム"} />
        <LinkButton to={"/othello"} title={"オセロ"} />
        <LinkButton to={"/yahtzee"} title={"ヨット"} />
      </div>
    </div>
  );
};

export default Main;
