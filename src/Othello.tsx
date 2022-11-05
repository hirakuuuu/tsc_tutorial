import { useState } from "react";
import "./style/App.css";
import { Repeat } from "typescript-tuple";

type squareState = "●" | "○" | undefined;

type SquareProps = {
  value: squareState;
  onClick: () => void;
};

const Square = (props: SquareProps) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

type BoardState = Repeat<squareState, 64>;

type BoardProps = {
  squares: BoardState;
  onClick: (i: number) => void;
};

const Board = (props: BoardProps) => {
  const renderSquare = (i: number) => {
    return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
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
  readonly xIsNext: boolean;
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
          "○",
          "●",
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "●",
          "○",
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

  const handleClick = (i: number) => {
    if (winner || current.squares[i]) return;

    // 置けるかどうかの判定
    const changeSquare: number[] | undefined = canPlace(
      i,
      current.squares,
      current.xIsNext
    );

    // console.log(changeSquare);

    if (changeSquare) {
      const next: Step = (({ squares, xIsNext }) => {
        const nextSquares = squares.slice() as BoardState;
        nextSquares[i] = xIsNext ? "●" : "○";
        for (let cs of changeSquare) {
          nextSquares[cs] = xIsNext ? "●" : "○";
        }
        return {
          squares: nextSquares,
          xIsNext: !xIsNext,
        };
      })(current);

      setState(({ history, stepNumber }) => {
        const newHistory = history.slice(0, stepNumber + 1).concat(next);

        return {
          history: newHistory,
          stepNumber: newHistory.length - 1,
        };
      });
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
        <Board squares={current.squares} onClick={handleClick} />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

const canPlace = (p: number, squares: BoardState, xIsNext: boolean) => {
  if (squares[p]) return undefined;

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
      squares[cx * 8 + cy] === (xIsNext ? "○" : "●")
    ) {
      cx += dx[i];
      cy += dy[i];
    }

    if (
      0 <= cx &&
      cx < 8 &&
      0 <= cy &&
      cy < 8 &&
      squares[cx * 8 + cy] === (xIsNext ? "●" : "○")
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
