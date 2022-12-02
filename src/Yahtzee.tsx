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
// type HandProps = {
//   name: string;
//   score: number | undefined;
// };

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
      // スコアが算出される前には更新しないようにする
      if (state.scores[i].value === undefined) {
        return;
      }
      setState(({ scores, dices, stepNumber, rotateNumber }) => {
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
          <Button
            variant="text"
            onClick={setScore}
            style={{ padding: "0px", fontSize: "1rem" }}
          >
            {state.scores[i].value !== undefined ? state.scores[i].value : "-"}
          </Button>
        </td>
      </tr>
    );
  };
  const renderTotalScore = () => {
    let total_score: number = 0;
    for (let i = 0; i < 12; i++) {
      total_score += state.scores[i].used
        ? (state.scores[i].value as number)
        : 0;
    }
    return (
      <tr>
        <th scope="row">総合得点</th>
        <td>
          <span className="total-score-label">{total_score}</span>
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
        className="dice-button"
        onClick={setKeeped}
        style={{ padding: "20px" }}
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
    if (state.rotateNumber === 3) {
      window.alert("3回まわしたので役を選んでね");
      return;
    }
    // ここを遅らせたい

    setState(({ scores, dices, stepNumber, rotateNumber }) => {
      const newDices = dices.slice() as BoardState;
      for (let i = 0; i < 5; i++) {
        if (newDices[i].keeped) {
          continue;
        }
        newDices[i].roll = Math.floor(Math.random() * 6);
      }
      return {
        scores: scores,
        dices: newDices,
        stepNumber: stepNumber,
        rotateNumber: rotateNumber + 1,
      };
    });
    setTimeout(() => {
      setState(({ scores, dices, stepNumber, rotateNumber }) => {
        const newScores = scores.slice() as AllScoreState;
        for (let i = 0; i < 12; i++) {
          if (newScores[i].used) continue;
          newScores[i].value = calc_score(i, dices);
        }
        return {
          scores: newScores,
          dices: dices,
          stepNumber: stepNumber,
          rotateNumber: rotateNumber,
        };
      });
    }, 3100);
  };

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
              {renderTotalScore()}
            </tbody>
          </table>
        </Paper>
      </div>
      <div className="board">
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
