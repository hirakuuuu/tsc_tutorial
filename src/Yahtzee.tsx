import { useState } from "react";
import Dice from "./components/Dice";
import { Repeat } from "typescript-tuple";
import { Paper } from "@material-ui/core";
import GameButton from "./components/GameButton";

import "./style/Yahtzee.css";

// 役
type HandProps = {
  name: string;
  score: number | undefined;
};

// さいころ
type DiceState = {
  roll: number;
  rotated: boolean;
};

type ScoreState = Repeat<number | undefined, 12>;
type BoardState = Repeat<DiceState, 5>;

// ゲームの状態
type GameState = {
  readonly scores: ScoreState;
  readonly dices: BoardState;
  readonly stepNumber: number;
};

const Hand = (props: HandProps) => {
  return (
    <tr>
      <th>{props.name}</th>
      <td>{props.score}</td>
    </tr>
  );
};

const Game = () => {
  const [state, setState] = useState<GameState>({
    scores: [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    dices: [
      {
        roll: 0,
        rotated: false,
      },
      {
        roll: 0,
        rotated: false,
      },
      {
        roll: 0,
        rotated: false,
      },
      {
        roll: 0,
        rotated: false,
      },
      {
        roll: 0,
        rotated: false,
      },
    ],
    stepNumber: 1,
  });

  const handName = [
    "エース",
    "デュース",
    "トレイ",
    "フォー",
    "ファイブ",
    "シックス",
    "チョイス",
    "フォーダイス",
    "フルハウス",
    "Sストレート",
    "Bストレート",
    "ヨット",
  ];

  const renderHand = (i: number) => {
    return <Hand name={handName[i]} score={state.scores[i]} />;
  };

  return (
    <div>
      <Paper elevation={1}>
        <table>
          <tr>ターン{state.stepNumber}/12</tr>
          <tr>
            <th>役名</th>
            <th>得点</th>
          </tr>
          {renderHand(0)}
          {renderHand(1)}
          {renderHand(2)}
          {renderHand(3)}
          {renderHand(4)}
          {renderHand(5)}
          {renderHand(6)}
          {renderHand(7)}
          {renderHand(8)}
          {renderHand(9)}
          {renderHand(10)}
          {renderHand(11)}
          <tr>
            <th>得点</th>
            <td>{}</td>
          </tr>
        </table>
      </Paper>
      <div className="dice-wrapper">
        <Dice roll={state.dices[0].roll} rotated={state.dices[0].rotated} />
        <Dice roll={state.dices[1].roll} rotated={state.dices[1].rotated} />
        <Dice roll={state.dices[2].roll} rotated={state.dices[2].rotated} />
        <Dice roll={state.dices[3].roll} rotated={state.dices[3].rotated} />
        <Dice roll={state.dices[4].roll} rotated={state.dices[4].rotated} />
      </div>
      <div>
        <GameButton
          title={"回す"}
          onClick={() => {
            setState(({ scores, dices, stepNumber }) => {
              const newDices = dices.slice() as BoardState;
              for (let i = 0; i < 5; i++) {
                newDices[i].roll = Math.floor(Math.random() * 6);
                newDices[i].rotated = true;
              }
              return {
                scores: scores,
                dices: newDices,
                stepNumber: stepNumber,
              };
            });
          }}
        />
      </div>
    </div>
  );
};

const Yahtzee = () => {
  return <Game />;
};

const calc_sum = (dice: number[], selected: number) => {
  let score = 0;
  for (let i = 0; i < 5; i++) {
    score += dice[i] === selected ? selected : 0;
  }
  return score;
};

export default Yahtzee;
