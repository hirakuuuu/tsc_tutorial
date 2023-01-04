import React from "react";
import CardButton from "../components/organisms/CardButton";
import LinkButton from "../components/organisms/LinkButton";

import "../style/Main.css";

import logo from "../image/sample.jpg";
import marubatsu_logo from "../image/marubatsu.jpg";
import othello_logo from "../image/othello.jpg";
import yahtzee_logo from "../image/yahtzee.jpg";

const Main = () => {
  return (
    <div>
      <h1>目標:51個</h1>
      <h2>NEW</h2>
      <div className="game-button">
        <CardButton
          imagePath={yahtzee_logo}
          to={"/yahtzee_online"}
          title={"ヨットONLINE"}
          detail={"ヨットでオンライン対戦ができるようになりました"}
        />
      </div>
      <h2>ゲーム</h2>
      <div className="game-button">
        {/* <LinkButton to={"/marubatsu"} title={"〇☓ゲーム"} />
        <LinkButton to={"/othello"} title={"オセロ"} />
        <LinkButton to={"/yahtzee"} title={"ヨット"} />
        <LinkButton to={"/yahtzee_online"} title={"ヨットonline"} /> */}
        <CardButton
          imagePath={marubatsu_logo}
          to={"/marubatsu"}
          title={"〇☓ゲーム"}
          detail={"二人が交互に「○」と「✕」を書き込んでいき3つ並べるゲーム"}
        />
        <CardButton
          imagePath={othello_logo}
          to={"/othello"}
          title={"オセロ"}
          detail={"相手の駒を挟んで自分の駒に変えていくゲーム"}
        />
        <CardButton
          imagePath={yahtzee_logo}
          to={"/yahtzee"}
          title={"ヨット"}
          detail={"5個のサイコロで役を揃えるゲーム"}
        />
      </div>
    </div>
  );
};

export default Main;
