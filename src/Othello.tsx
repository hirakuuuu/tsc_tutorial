import { useState } from "react";
import "./style/Othello.css";
import { Repeat } from "typescript-tuple";

type squareState = "●" | undefined;
type squareColor = "#000" | "#fff" | undefined;

type SquareProps = {
  value: squareState;
  color: squareColor;
  onClick: () => void;
};

const Square = (props: SquareProps) => {
  return (
    <button className="square" style={{color: props.color}} onClick={props.onClick}>
      {props.value}
    </button>
  );
};

type BoardState = Repeat<squareState, 64>;
type ColorState = Repeat<squareColor, 64>;

type BoardProps = {
  squares: BoardState;
  colors: ColorState;
  onClick: (i: number) => void;
};

const Board = (props: BoardProps) => {
  const renderSquare = (i: number) => {
    return <Square value={props.squares[i]} color={props.colors[i]} onClick={() => props.onClick(i)} />;
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
  readonly colors: ColorState;
  readonly xIsNext: boolean;
  readonly count: [number, number];
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
          "●",
          "●",
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "●",
          "●",
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
        colors: [
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
          "#000",
          "#fff",
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "#fff",
          "#000",
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
        xIsNext: true,
        count: [2, 2]
      },
    ],
    stepNumber: 0,
  });

  const current = state.history[state.stepNumber];
  const winner = calculateWinner(current.squares);
  let status: string;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${current.xIsNext ? "●" : "○"}`;
  }

  let score: string = `●: ${current.count[0]}, ○: ${current.count[1]}`;

  const handleClick = (i: number) => {
    if (winner || current.squares[i]) return;

    // 置けるかどうかの判定
    const changeSquare: number[] | undefined = canPlace(
      i,
      current.squares,
      current.colors,
      current.xIsNext
    );
    console.log(changeSquare);
    if (changeSquare) {
      const next: Step = (({ squares, colors, xIsNext, count }) => {
        const nextSquares = squares.slice() as BoardState;
        const nextColors = colors.slice() as ColorState;
        const nextCount:[number, number] = [count[0], count[1]];
        nextSquares[i] = "●";
        nextColors[i] = xIsNext ? "#000" : "#fff";
        nextCount[xIsNext ? 0: 1] += changeSquare.length+1;
        nextCount[!xIsNext ? 0: 1] -= changeSquare.length;
        for (let cs of changeSquare) {
          nextColors[cs] = xIsNext ? "#000" : "#fff";
        }
        return {
          squares: nextSquares,
          colors: nextColors,
          xIsNext: !xIsNext,
          count: nextCount,
        };
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
    setState((prev) => ({
      ...prev,
      stepNumber: move,
    }));
  };

  const moves = state.history.map((step, move) => {
    const desc = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} colors={current.colors} onClick={handleClick} />
        <div className="status">{status}</div>
        <div className="score">{score}</div>
      </div>
      <div className="game-info">
        
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

const canPlace = (p: number, squares: BoardState, colors: ColorState, xIsNext: boolean) => {
  if (colors[p]) return undefined;

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
    // console.log(cx, cy, squares[cx * 8 + cy]);
    while (
      0 <= cx &&
      cx < 8 &&
      0 <= cy &&
      cy < 8 &&
      colors[cx * 8 + cy] === (xIsNext ? "#fff" : "#000")
    ) {
      cx += dx[i];
      cy += dy[i];
    }

    if (
      0 <= cx &&
      cx < 8 &&
      0 <= cy &&
      cy < 8 &&
      colors[cx * 8 + cy] === (xIsNext ? "#000" : "#fff")
    ) {
      cx -= dx[i];
      cy -= dy[i];
      while (cx !== pos.x || cy !== pos.y) {
        // console.log(cx, cy);
        changeSquare.push(cx * 8 + cy);
        cx -= dx[i];
        cy -= dy[i];
      }
    }
  }
  if (changeSquare.length > 0) return changeSquare;
  else return undefined;
};

const calculateWinner = (squares: BoardState) => {
  return undefined;
};

const Othello = () => {
  return <Game />;
};

export default Othello;
