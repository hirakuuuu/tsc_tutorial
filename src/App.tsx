import React, { useState } from "react";

import Board from "./components/Square";
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

function Game() {
  const [history, setHistory] = useState<string[][]>([
    Array(9).fill(undefined),
  ]);
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const handleClick = (i: number) => {
    const newHistory: string[][] = history.slice();
    const newCurrent: string[] = newHistory[newHistory.length - 1];
    const newSquares = newCurrent.slice();
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }
    newSquares[i] = xIsNext ? "X" : "O";
    setHistory(history.concat(newSquares));
    setXIsNext(!xIsNext);
  };

  const current: string[] = history[history.length - 1];
  const winner: string | undefined = calculateWinner(current);
  let status: string;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current} onClick={handleClick(i)} />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}

export default Game;
