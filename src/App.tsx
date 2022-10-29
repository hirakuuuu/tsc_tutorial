import React, { useState } from "react";

import "./style/App.css";

const calculateWinner = (squares: string[]): string | undefined => {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log(squares[a], squares[b], squares[c]);
      return squares[a];
    }
  }
  return undefined;
};

const Square = ({
  value,
  onClick,
}: {
  value: string;
  onClick: VoidFunction;
}) => {
  // stateの型も指定できる
  // const [value, setValue] = useState<string>(undefined);

  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

const Board = () => {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(undefined));
  const [XisNext, setXisNext] = useState<boolean>(true);

  const handleClick = (i: number) => {
    const newSquares = squares.slice();
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }
    newSquares[i] = XisNext ? "X" : "O";
    setSquares(newSquares);
    setXisNext(!XisNext);
  };

  const renderSquare = (i: number) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  };

  const winner: string | undefined = calculateWinner(squares);
  let status: string = "";
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (XisNext ? "X" : "O");
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}

export default Game;
