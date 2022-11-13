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
  keeped: boolean;
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
        keeped: false,
      },
      {
        roll: 0,
        rotated: false,
        keeped: false,
      },
      {
        roll: 0,
        rotated: false,
        keeped: false,
      },
      {
        roll: 0,
        rotated: false,
        keeped: false,
      },
      {
        roll: 0,
        rotated: false,
        keeped: false,
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

  const renderDice = (i: number) => {
    const setKeeped = () => {
      setState(({ scores, dices, stepNumber }) => {
        const newDices = dices.slice() as BoardState;
        console.log(newDices[i].keeped);
        if (newDices[i].rotated) {
          newDices[i].keeped = !newDices[i].keeped;
        }
        return {
          scores: scores,
          dices: newDices,
          stepNumber: stepNumber,
        };
      });
    };

    return (
      <div
        style={{ border: state.dices[i].keeped ? "2px solid #000000" : "none" }}
      >
        <Dice roll={state.dices[i].roll} rotated={state.dices[i].rotated} />
        <GameButton title={"キープ"} onClick={setKeeped} />
      </div>
    );
  };

  // サイコロを回したときの処理
  const rotate = () => {
    setState(({ scores, dices, stepNumber }) => {
      const newDices = dices.slice() as BoardState;
      for (let i = 0; i < 5; i++) {
        if (newDices[i].rotated) {
          continue;
        }
        newDices[i].roll = Math.floor(Math.random() * 6);
        newDices[i].rotated = true;
      }

      const newScores = scores.slice() as ScoreState;
      for (let i = 0; i < 12; i++) {
        newScores[i] = calc_score(i, newDices);
      }
      return {
        scores: newScores,
        dices: newDices,
        stepNumber: stepNumber,
      };
    });
  };

  // リセット
  const reset = () => {
    setState(({ scores, dices, stepNumber }) => {
      const newDices = dices.slice() as BoardState;
      for (let i = 0; i < 5; i++) {
        if (newDices[i].keeped) continue;
        newDices[i].rotated = false;
      }
      return {
        scores: scores,
        dices: newDices,
        stepNumber: stepNumber,
      };
    });
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
        {renderDice(0)}
        {renderDice(1)}
        {renderDice(2)}
        {renderDice(3)}
        {renderDice(4)}
        {/* 
        <Dice roll={state.dices[0].roll} rotated={state.dices[0].rotated} />
        <Dice roll={state.dices[1].roll} rotated={state.dices[1].rotated} />
        <Dice roll={state.dices[2].roll} rotated={state.dices[2].rotated} />
        <Dice roll={state.dices[3].roll} rotated={state.dices[3].rotated} />
        <Dice roll={state.dices[4].roll} rotated={state.dices[4].rotated} /> */}
      </div>
      <div>
        <GameButton title={"回す"} onClick={rotate} />
        <GameButton title={"リセット"} onClick={reset} />
      </div>
    </div>
  );
};

const Yahtzee = () => {
  return <Game />;
};

const calc_score = (index: number, dice: BoardState) => {
  let score = 0;
  // 各目の個数をカウント
  let cnt_roll: number[] = new Array(6).fill(0);
  let sum_roll: number = 0;
  for (let i = 0; i < 5; i++) {
    cnt_roll[dice[i].roll]++;
    sum_roll += dice[i].roll + 1;
  }

  if (index < 6) {
    // エースからシックス
    score = cnt_roll[index] * (index + 1);
  } else if (index === 6) {
    // チョイス
    score = sum_roll;
  } else if (index === 7) {
    // フォーダイス
    for (let i = 0; i < 6; i++) {
      if (cnt_roll[i] >= 4) {
        score = sum_roll;
      }
    }
  } else if (index === 8) {
    // フルハウス
    let fh_flag: number = 1;
    for (let i = 0; i < 6; i++) {
      if (cnt_roll[i] === 3) {
        fh_flag *= 3;
      } else if (cnt_roll[i] === 2) {
        fh_flag *= 2;
      }
    }
    if (fh_flag === 6) {
      score = sum_roll;
    }
  } else if (index === 9) {
    for (let i = 0; i < 3; i++) {
      let ss_flag: number = 0;
      for (let j = i; j < i + 4; j++) {
        if (cnt_roll[j] >= 1) {
          ss_flag++;
        }
      }
      if (ss_flag === 4) {
        score = 15;
      }
    }
  } else if (index === 10) {
    for (let i = 0; i < 2; i++) {
      let ss_flag: number = 0;
      for (let j = i; j < i + 5; j++) {
        if (cnt_roll[j] >= 1) {
          ss_flag++;
        }
      }
      if (ss_flag === 5) {
        score = 30;
      }
    }
  } else if (index === 11) {
    for (let i = 0; i < 6; i++) {
      if (cnt_roll[i] === 5) {
        score = 50;
      }
    }
  }
  return score;
};

export default Yahtzee;
