import { useState } from "react";
import Dice from "./components/Dice";
import { Repeat } from "typescript-tuple";
import { Paper, Button } from "@material-ui/core";
import GameButton from "./components/GameButton";

import "./style/Yahtzee.css";

/*
このステップを12回繰り返す
  ゲームの流れ
  1回目のサイコロ
  キープするサイコロを選ぶ
  2回目のサイコロ
  キープするサイコロを選ぶ
  3回目のサイコロ
  全てのサイコロをキープ
  役を選ぶ
  選んだ役を選べないようにする
  サイコロをリセット
*/

// 役
type HandProps = {
  name: string;
  score: number | undefined;
};

// さいころ
type DiceState = {
  roll: number;
  keeped: boolean;
};

// スコアの状態
type ScoreState = {
  value: number | undefined;
  used: boolean;
};

type AllScoreState = Repeat<ScoreState, 12>;
type BoardState = Repeat<DiceState, 5>;

// ゲームの状態
type GameState = {
  readonly scores: AllScoreState;
  readonly dices: BoardState;
  readonly stepNumber: number;
  readonly rotateNumber: number;
};

const Game = () => {
  const [state, setState] = useState<GameState>({
    scores: [
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
      { value: undefined, used: false },
    ],
    dices: [
      {
        roll: 0,
        keeped: false,
      },
      {
        roll: 0,
        keeped: false,
      },
      {
        roll: 0,
        keeped: false,
      },
      {
        roll: 0,
        keeped: false,
      },
      {
        roll: 0,
        keeped: false,
      },
    ],
    stepNumber: 1,
    rotateNumber: 0,
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
    // スコアを固定
    const setScore = () => {
      setState(({ scores, dices, stepNumber, rotateNumber }) => {
        // スコアが算出される前には更新しないようにする
        if (scores[i].value === undefined) {
          return {
            scores: scores,
            dices: dices,
            stepNumber: stepNumber,
            rotateNumber: rotateNumber,
          };
        }
        // スコアが算出されているならその役を使用済みにする
        const newScores = scores.slice() as AllScoreState;
        newScores[i].used = true;
        for (let i = 0; i < 12; i++) {
          if (newScores[i].used) continue;
          newScores[i].value = undefined;
        }

        // サイコロの状態をリセットする
        const newDices = dices.slice() as BoardState;
        for (let i = 0; i < 5; i++) {
          newDices[i].keeped = false;
        }

        return {
          scores: newScores,
          dices: newDices,
          stepNumber: stepNumber + 1,
          rotateNumber: 0,
        };
      });
    };
    return (
      <tr>
        <th>{handName[i]}</th>
        <td
          style={{
            opacity: state.scores[i].used ? 1.0 : 0.5,
          }}
        >
          <Button variant="text" onClick={setScore}>
            {state.scores[i].value !== undefined ? state.scores[i].value : "-"}
          </Button>
        </td>
      </tr>
    );
  };

  const renderDice = (i: number) => {
    const setKeeped = () => {
      setState(({ scores, dices, stepNumber, rotateNumber }) => {
        const newDices = dices.slice() as BoardState;
        if (rotateNumber > 0) {
          newDices[i].keeped = !newDices[i].keeped;
        }
        return {
          scores: scores,
          dices: newDices,
          stepNumber: stepNumber,
          rotateNumber: rotateNumber,
        };
      });
    };

    return (
      <Button
        variant="text"
        onClick={setKeeped}
        style={{ border: state.dices[i].keeped ? "2px solid #000000" : "none" }}
      >
        <Dice
          roll={state.dices[i].roll}
          rotated={state.rotateNumber}
          keeped={state.dices[i].keeped}
        />
      </Button>
    );
  };

  // サイコロを回したときの処理
  const rotate = () => {
    setState(({ scores, dices, stepNumber, rotateNumber }) => {
      const newDices = dices.slice() as BoardState;
      // for (let i = 0; i < 5; i++) {
      //   if (newDices[i].rotated) {
      //     continue;
      //   }
      //   newDices[i].roll = Math.floor(Math.random() * 6);
      //   newDices[i].rotated = true;
      // }
      for (let i = 0; i < 5; i++) {
        if (newDices[i].keeped) {
          continue;
        }
        newDices[i].roll = Math.floor(Math.random() * 6);
      }

      const newScores = scores.slice() as AllScoreState;
      for (let i = 0; i < 12; i++) {
        if (newScores[i].used) continue;
        console.log(newScores[i].used);
        newScores[i].value = calc_score(i, newDices);
      }
      return {
        scores: newScores,
        dices: newDices,
        stepNumber: stepNumber,
        rotateNumber: rotateNumber + 1,
      };
    });
  };

  // リセット
  // const reset = () => {
  //   setState(({ scores, dices, stepNumber, rotateNumber }) => {
  //     const newDices = dices.slice() as BoardState;
  //     for (let i = 0; i < 5; i++) {
  //       if (newDices[i].keeped) continue;
  //       newDices[i].rotated = false;
  //     }
  //     return {
  //       scores: scores,
  //       dices: newDices,
  //       stepNumber: stepNumber,
  //       rotateNumber: rotateNumber,
  //     };
  //   });
  // };

  return (
    <div className="game-wrapper">
      <div className="score-table-wrapper">
        <Paper elevation={1}>
          <table className="score-table">
            <tbody>
              <tr>
                <th>ターン{state.stepNumber}/12</th>
              </tr>
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
            </tbody>
          </table>
        </Paper>
      </div>
      <div className="dice-wrapper">
        {renderDice(0)}
        {renderDice(1)}
        {renderDice(2)}
        {renderDice(3)}
        {renderDice(4)}
      </div>
      <div>
        <GameButton title={"回す"} onClick={rotate} />
      </div>
    </div>
  );
};

// スコアの計算
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

const Yahtzee = () => {
  return <Game />;
};

export default Yahtzee;
