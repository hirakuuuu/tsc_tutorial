import { useState } from "react";
import "./style/Othello.css";
import { Repeat } from "typescript-tuple";

type squareState = true | false | undefined;

type SquareProps = {
  value: squareState;
  canPlace: boolean;
  onClick: () => void;
};

const Square = (props: SquareProps) => {
  return (
    <button
      className="square"
      style={{
        color: props.value ? "#000" : "#fff",
        backgroundColor: props.canPlace ? "#61ca90" : "#3cb371",
      }}
      onClick={props.onClick}
    >
      {props.value !== undefined ? "●" : undefined}
    </button>
  );
};

type BoardState = Repeat<squareState, 64>;
type PlaceState = Repeat<boolean, 64>;

type BoardProps = {
  squares: BoardState;
  places: PlaceState;
  onClick: (i: number) => void;
};

const Board = (props: BoardProps) => {
  const renderSquare = (i: number) => {
    return (
      <Square
        value={props.squares[i]}
        // color={props.colors[i]}
        canPlace={props.places[i]}
        onClick={() => props.onClick(i)}
      />
    );
  };
  let SquareList: JSX.Element[][] = [];
  for (let i = 0; i < 8; i++) {
    SquareList[i] = [];
    for (let j = 0; j < 8; j++) {
      SquareList[i][j] = renderSquare(i * 8 + j);
    }
  }
  let RowList: JSX.Element[] = [];
  for (let i = 0; i < 8; i++) {
    RowList[i] = <div className="board-row">{SquareList[i]}</div>;
  }
  return (
    <div>
      {RowList[0]}
      {RowList[1]}
      {RowList[2]}
      {RowList[3]}
      {RowList[4]}
      {RowList[5]}
      {RowList[6]}
      {RowList[7]}
    </div>
  );
};

type Step = {
  readonly squares: BoardState;
  readonly places: PlaceState;
  readonly xIsNext: boolean;
  readonly count: [number, number];
  readonly ending: boolean;
};

type GameState = {
  readonly history: readonly Step[];
  readonly stepNumber: number;
};

const Game = () => {
  const [state, setState] = useState<GameState>({
    history: [
      {
        squares: [
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
          undefined,
          undefined,
          undefined,
          true,
          false,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          false,
          true,
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
          undefined,
          undefined,
          undefined,
        ],
        places: [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          true, //
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          true, //
          false,
          false,
          false,
          false,
          true, //
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          true, //
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
        xIsNext: true,
        count: [2, 2],
        ending: false,
      },
    ],
    stepNumber: 0,
  });

  const current = state.history[state.stepNumber];
  const winner = calculateWinner(current.ending, current.count);
  let status: string;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${current.xIsNext ? "●" : "○"}`;
  }

  let score: string = `●: ${current.count[0]} 　　 ○: ${current.count[1]}`;

  const handleClick = (i: number) => {
    console.log(i);
    if (winner || current.squares[i]) return;

    // 置けるかどうかの判定
    const changeSquare: number[] | undefined = canPlace(
      i,
      current.squares,
      current.places[i],
      current.xIsNext
    );
    console.log(changeSquare);
    if (changeSquare) {
      const next: Step = (({ squares, places, xIsNext, count, ending }) => {
        const nextSquares = squares.slice() as BoardState;
        const nextCount: [number, number] = [count[0], count[1]];
        nextSquares[i] = xIsNext;
        nextSquares[i] = xIsNext;
        for (let cs of changeSquare) {
          nextSquares[cs] = xIsNext;
        }
        nextCount[xIsNext ? 0 : 1] += changeSquare.length + 1;
        nextCount[!xIsNext ? 0 : 1] -= changeSquare.length;
        const nextPlaces = changePlace(nextSquares, [...places], xIsNext);
        const nextPlaces_enemy = changePlace(
          nextSquares,
          [...places],
          !xIsNext
        );
        if (placeExists(nextPlaces)) {
          return {
            squares: nextSquares,
            places: nextPlaces,
            xIsNext: !xIsNext,
            count: nextCount,
            ending: false,
          };
        } else if (placeExists(nextPlaces_enemy)) {
          window.alert("おける場所がないのでパスします");
          return {
            squares: nextSquares,
            places: nextPlaces_enemy,
            xIsNext: xIsNext,
            count: nextCount,
            ending: false,
          };
        } else {
          return {
            squares: nextSquares,
            places: nextPlaces,
            xIsNext: !xIsNext,
            count: nextCount,
            ending: true,
          };
        }
      })(current);

      setState(({ history, stepNumber }) => {
        const newHistory = history.slice(0, stepNumber + 1).concat(next);

        return {
          history: newHistory,
          stepNumber: newHistory.length - 1,
        };
      });
    } else {
      window.alert("そこにはおけないよ");
    }
  };

  const jumpTo = (move: number) => {
    if (
      state.stepNumber + move < 0 ||
      state.history.length <= state.stepNumber + move
    ) {
      return;
    }
    setState((prev) => ({
      ...prev,
      stepNumber: prev.stepNumber + move,
    }));
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          places={current.places}
          onClick={handleClick}
        />
        <div className="status">
          <button onClick={() => jumpTo(-1)}>◀</button>
          <span className="status-text">{status}</span>
          <button onClick={() => jumpTo(1)}>▶</button>
        </div>
        <div className="score">{score}</div>
      </div>
    </div>
  );
};

// 次にそのマスにおけるかどうかを判定
const canPlace = (
  p: number,
  squares: BoardState,
  place: boolean,
  xIsNext: boolean
) => {
  if (!place) return undefined;

  let changeSquare: number[] = [];
  const dx: number[] = [-1, 0, 1, -1, 1, -1, 0, 1];
  const dy: number[] = [-1, -1, -1, 0, 0, 1, 1, 1];

  const pos = {
    y: p % 8,
    x: Math.floor(p / 8),
  };

  for (let i = 0; i < 8; i++) {
    let cx = pos.x + dx[i];
    let cy = pos.y + dy[i];
    while (
      0 <= cx &&
      cx < 8 &&
      0 <= cy &&
      cy < 8 &&
      squares[cx * 8 + cy] === (xIsNext ? false : true)
    ) {
      cx += dx[i];
      cy += dy[i];
    }

    if (
      0 <= cx &&
      cx < 8 &&
      0 <= cy &&
      cy < 8 &&
      squares[cx * 8 + cy] === (xIsNext ? true : false)
    ) {
      cx -= dx[i];
      cy -= dy[i];
      while (cx !== pos.x || cy !== pos.y) {
        changeSquare.push(cx * 8 + cy);
        cx -= dx[i];
        cy -= dy[i];
      }
    }
  }
  if (changeSquare.length > 0) return changeSquare;
  else return undefined;
};

// 全てのマスに対して、おけるかどうかを判定
const changePlace = (
  nextSquares: BoardState,
  curPlaces: PlaceState,
  xIsNext: boolean
) => {
  for (let i = 0; i < 64; i++) {
    let isPlaced = nextSquares[i] === undefined;
    const changeSquare = canPlace(i, nextSquares, isPlaced, !xIsNext);
    curPlaces[i] = changeSquare !== undefined;
  }
  return curPlaces;
};

// 勝敗判定
// 両者ともおけるマスが無い状態 かつ 駒が多い方
const calculateWinner = (ending: boolean, count: [number, number]) => {
  if (!ending) return undefined;
  if (count[0] > count[1]) {
    return "●";
  } else if (count[0] < count[1]) {
    return "○";
  } else {
    return "draw";
  }
};

// おける場所があるかどうか
const placeExists = (places: PlaceState) => {
  for (let i = 0; i < 64; i++) {
    if (places[i]) {
      return true;
    }
  }
  return false;
};

const Othello = () => {
  return <Game />;
};

export default Othello;
