import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

import "./style/Main.css";

type ButtonProps = {
  to: string;
  title: string;
};

const GameButton = (props: ButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to={props.to}
      style={{ marginRight: "20px" }}
    >
      {props.title}
    </Button>
  );
};

const Main = () => {
  return (
    <div>
      <h1>なんか作ったら追加していきます</h1>
      <div className="game-button">
        <GameButton to={"/othello"} title={"オセロ"} />
        <GameButton to={"/marubatsu"} title={"〇☓ゲーム"} />
      </div>
    </div>
  );
};

export default Main;
