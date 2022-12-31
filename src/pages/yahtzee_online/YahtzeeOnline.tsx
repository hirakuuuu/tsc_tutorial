import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Repeat } from "typescript-tuple";
import { Paper, Button, Tooltip } from "@material-ui/core";

import Dice from "../../components/organisms/yahtzee/Dice";
import GameButton from "../../components/organisms/GameButton";
import HowToModal from "../../components/organisms/HowToModal";

import "../../style/yahtzee/Yahtzee.css";

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
  readonly scores: Repeat<AllScoreState, 2>;
  readonly dices: BoardState;
  readonly stepNumber: number;
  readonly rotateNumber: number;
};

const Game = (props: any) => {
  const [state, setState] = useState<GameState>({
    scores: [
      [
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
      [
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
    stepNumber: 0,
    rotateNumber: 0,
  });
  // 遊び方
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ソケット
  const socket = props.socket;
  // 遷移前からのステート
  const location = useLocation();
  const roomId = location.state.roomId;
  const players = [location.state.player1, location.state.player2];
  const myTurn: number = location.state.firstPlayer === socket.id ? 0 : 1;

  socket.on("YAHTZEE_CHANGE_TURN_TO", (state: GameState) => {
    setState(state);
  });

  socket.on("YAHTZEE_CHANGE_KEEP_TO", (dices: Repeat<DiceState, 5>) => {
    setState((prevstate) => {
      return {
        ...prevstate,
        dices: dices,
      };
    });
  });

  socket.on(
    "YAHTZEE_CHANGE_DICE_TO",
    (data: { dices: Repeat<DiceState, 5>; rotateNumber: number }) => {
      setState((prevstate) => {
        return {
          ...prevstate,
          dices: data.dices,
          rotateNumber: data.rotateNumber,
        };
      });
    }
  );

  socket.on("YAHTZEE_CHANGE_SCORE_TO", (scores: Repeat<AllScoreState, 2>) => {
    setState((prevstate) => {
      return {
        ...prevstate,
        scores: scores,
      };
    });
  });

  // useEffect(() => {

  //   // これをしないと2回追加する
  //   return () => {
  //     socket.off("YAHTZEE_CHANGE_TURN_TO");
  //   };
  // }, []);

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

  const handIcon = [
    "icon-ace",
    "icon-deuce",
    "icon-tray",
    "icon-four",
    "icon-five",
    "icon-six",
    "icon-choice",
    "icon-fourdice",
    "icon-fullhouse",
    "icon-shortstrate",
    "icon-bigstrate",
    "icon-yahtzee",
  ];

  const handDetail = [
    "1の目の合計値が得点",
    "2の目の合計値が得点",
    "3の目の合計値が得点",
    "4の目の合計値が得点",
    "5の目の合計値が得点",
    "6の目の合計値が得点",
    "さいころの合計値が得点",
    "4個同じ目が出たら成立\n合計値が得点",
    "2個と3個の組み合わせで成立\n合計値が得点",
    "4個のさいころの連番で成立\n出目を問わず15点",
    "5個のさいころの連番で成立\n出目を問わず30点",
    "5個同じ目が出たら成立\n出目を問わず50点",
  ];

  const renderTooltip = (text: string, detail: string, icon?: string) => {
    return (
      <Tooltip
        title={<span style={{ fontSize: "0.8rem" }}>{detail}</span>}
        placement="right-end"
      >
        <th>
          <div className="hand-name-cell">
            <div className={icon}></div>
            <span>{text}</span>
          </div>
        </th>
      </Tooltip>
    );
  };

  const renderHandName = (i: number) => {
    return renderTooltip(handName[i], handDetail[i], handIcon[i]);
  };

  const renderHandScore = (player_num: number, i: number) => {
    // スコアを固定
    const setScore = () => {
      if (myTurn === player_num) {
        // スコアが算出される前には更新しないようにする
        if (state.scores[player_num][i].value === undefined) {
          return;
        }
        // スコアがすでに使われているなら更新しない
        if (state.scores[player_num][i].used) {
          return;
        }
        setState(({ scores, dices, stepNumber, rotateNumber }) => {
          // スコアが算出されているならその役を使用済みにする
          const newScores = scores.slice() as Repeat<AllScoreState, 2>;
          newScores[player_num][i].used = true;
          for (let i = 0; i < 12; i++) {
            if (newScores[player_num][i].used) continue;
            newScores[player_num][i].value = undefined;
          }

          // サイコロの状態をリセットする
          const newDices = dices.slice() as BoardState;
          for (let i = 0; i < 5; i++) {
            newDices[i].keeped = false;
          }

          if (stepNumber === 23) {
            if (calcTotalScore(0) > calcTotalScore(1)) {
              window.alert("player1の勝利!!!");
            } else if (calcTotalScore(0) < calcTotalScore(1)) {
              window.alert("player2の勝利!!!");
            } else {
              window.alert("引き分け!!!");
            }
          }
          socket.emit("YAHTZEE_CHANGE_TURN_FROM", {
            state: {
              scores: newScores,
              dices: newDices,
              stepNumber: stepNumber + 1,
              rotateNumber: 0,
            },
            roomId,
          });

          return {
            scores: newScores,
            dices: newDices,
            stepNumber: stepNumber + 1,
            rotateNumber: 0,
          };
        });
      } else {
        window.alert("相手の番です");
      }
    };
    return (
      <td
        className={
          state.stepNumber % 2 === player_num && state.stepNumber !== 24
            ? "score-table-cell"
            : ""
        }
        style={{
          opacity: state.scores[player_num][i].used ? 1.0 : 0.7,
        }}
      >
        <Button
          variant="text"
          onClick={setScore}
          style={{
            padding: "0px",
            fontSize: "1rem",
          }}
        >
          {state.scores[player_num][i].value !== undefined
            ? state.scores[player_num][i].value
            : "-"}
        </Button>
      </td>
    );
  };

  const renderHand = (i: number) => {
    return (
      <tr>
        {renderHandName(i)}
        {renderHandScore(0, i)}
        {renderHandScore(1, i)}
      </tr>
    );
  };

  const renderSubtotalScore = (player_num: number) => {
    return (
      <td>
        <Button
          disabled
          style={{
            padding: "0px",
            fontSize: "1rem",
          }}
        >
          <span
            style={{
              color: "rgba(0, 0, 0, 1)",
            }}
          >
            {bonus(player_num)}/63
          </span>
        </Button>
      </td>
    );
  };

  const renderSubtotal = () => {
    return (
      <tr>
        <th>
          <div className="hand-name-cell">
            <span>小計</span>
          </div>
        </th>
        {renderSubtotalScore(0)}
        {renderSubtotalScore(1)}
      </tr>
    );
  };

  const renderBonusScore = (player_num: number) => {
    return (
      <td>
        <Button
          disabled
          style={{
            padding: "0px",
            fontSize: "1rem",
          }}
        >
          <span
            style={{
              color: "rgba(0, 0, 0, 1)",
            }}
          >
            {bonus(player_num) >= 63 ? "+35" : "+0"}
          </span>
        </Button>
      </td>
    );
  };

  const renderBonus = () => {
    return (
      <tr>
        <th>
          <div className="hand-name-cell">
            <span>ボーナス＋35</span>
          </div>
        </th>
        {renderBonusScore(0)}
        {renderBonusScore(1)}
      </tr>
    );
  };

  const bonus = (player_num: number): number => {
    let bonusScoreSum: number = 0;
    for (let i = 0; i < 6; i++) {
      if (state.scores[player_num][i].used) {
        bonusScoreSum += state.scores[player_num][i].value as number;
      }
    }
    return bonusScoreSum;
  };

  const calcTotalScore = (player_num: number) => {
    let total_score: number = 0;
    // スコアの合計を求める
    for (let i = 0; i < 12; i++) {
      total_score += state.scores[player_num][i].used
        ? (state.scores[player_num][i].value as number)
        : 0;
    }
    // ボーナスを達成しているなら35点足す
    if (bonus(player_num) >= 63) {
      total_score += 35;
    }
    return total_score;
  };

  const renderTotalScore = (player_num: number) => {
    return (
      <td
        className={
          state.stepNumber % 2 === player_num && state.stepNumber !== 24
            ? "score-table-cell"
            : ""
        }
      >
        <span className="total-score-label">{calcTotalScore(player_num)}</span>
      </td>
    );
  };

  const renderTotal = () => {
    return (
      <tr>
        <th scope="row">総合得点</th>
        {renderTotalScore(0)}
        {renderTotalScore(1)}
      </tr>
    );
  };

  const renderDice = (i: number) => {
    const setKeeped = () => {
      if (myTurn === state.stepNumber % 2) {
        setState((prevstate) => {
          const newDices = prevstate.dices.slice() as BoardState;
          if (prevstate.rotateNumber > 0) {
            newDices[i].keeped = !newDices[i].keeped;
          }
          socket.emit("YAHTZEE_CHANGE_KEEP_FROM", {
            dices: newDices,
            roomId,
          });

          return {
            ...prevstate,
            dices: newDices,
          };
        });
      } else {
        window.alert("相手の番です");
      }
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
    if (myTurn === state.stepNumber % 2) {
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
        socket.emit("YAHTZEE_CHANGE_DICE_FROM", {
          dices: newDices,
          rotateNumber: rotateNumber + 1,
          roomId,
        });

        return {
          scores: scores,
          dices: newDices,
          stepNumber: stepNumber,
          rotateNumber: rotateNumber + 1,
        };
      });
      setTimeout(() => {
        console.log(state.stepNumber);
        setState((prevstate) => {
          const newScores = prevstate.scores.slice() as Repeat<
            AllScoreState,
            2
          >;
          for (let i = 0; i < 12; i++) {
            if (newScores[prevstate.stepNumber % 2][i].used) continue;
            newScores[prevstate.stepNumber % 2][i].value = calc_score(
              i,
              prevstate.dices
            );
          }
          socket.emit("YAHTZEE_CHANGE_SCORE_FROM", {
            scores: newScores,
            roomId,
          });
          return {
            ...prevstate,
            scores: newScores,
          };
        });
      }, 3100);
    } else {
      window.alert("相手の番です");
    }
  };

  return (
    <div className="game-wrapper">
      <Paper elevation={1}>
        <div className="score-table-wrapper">
          <table className="score-table">
            <tbody>
              <tr>
                <th>
                  ターン{Math.min(12, Math.floor(state.stepNumber / 2) + 1)}/12
                </th>
                <th>{players[0]}</th>
                <th>{players[1]}</th>
              </tr>
              <tr>
                <th>役名</th>
                <th>得点</th>
                <th>得点</th>
              </tr>
              {renderHand(0)}
              {renderHand(1)}
              {renderHand(2)}
              {renderHand(3)}
              {renderHand(4)}
              {renderHand(5)}
              {renderSubtotal()}
              {renderBonus()}
              <tr>
                <td colSpan={3}>
                  <span className="bonus-text">
                    <div className="icon-ace"></div>～
                    <div className="icon-six"></div>
                    の合計が63点以上でボーナス
                  </span>
                </td>
              </tr>
              {renderHand(6)}
              {renderHand(7)}
              {renderHand(8)}
              {renderHand(9)}
              {renderHand(10)}
              {renderHand(11)}
              {renderTotal()}
            </tbody>
          </table>
        </div>
      </Paper>
      <div className="board">
        <div className="dice-wrapper">
          {renderDice(0)}
          {renderDice(1)}
          {renderDice(2)}
          {renderDice(3)}
          {renderDice(4)}
        </div>
        <div>
          <div className="rotate-text">あと{3 - state.rotateNumber}回</div>
          <GameButton title={"回す"} onClick={rotate} />
        </div>
      </div>
      <HowToModal
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        content={
          <div>
            <h2>ゲームの進行</h2>
            <p>
              １．自分の番になったら、まずダイスを５個振ります。
              気に入らなかったらあと２回振り直すことが出来ます。
              振り直すときは、何個でもかまいません。１個でも全部でもかまいません。
            </p>
            <p>
              ２．出た目を１２種類の役の中のどれかに割り当て、点数のボタンを押します。
              点数の付け方は役によって違いますので注意して下さい。
              また、一つの役は１回しか選ぶことができませんので注意して下さい。
            </p>
            <p>
              ３．点数を記入したら次の人の番になります。
              一周して自分の番が回ってきたら、またダイスを振って空いている役を埋めます。
            </p>
            <p>
              ４．１２周したらすべての役が埋まります。
              点数を合計し、一番合計の多い人が勝ちます。
            </p>
          </div>
        }
      />
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
      if (cnt_roll[i] === 5) {
        fh_flag *= 6;
      } else if (cnt_roll[i] === 3) {
        fh_flag *= 3;
      } else if (cnt_roll[i] === 2) {
        fh_flag *= 2;
      }
    }
    if (fh_flag === 6) {
      score = sum_roll;
    }
  } else if (index === 9) {
    // ショートストレート
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
    // ビックストレート
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

const YahtzeeOnline = (props: any) => {
  return <Game socket={props.socket} />;
};

export default YahtzeeOnline;
