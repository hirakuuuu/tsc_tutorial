import { useEffect, useState } from "react";

import "../../style/yahtzee/LoadingDice.css";

// 参考 https://little-strange.hatenablog.com/entry/2021/11/18/224629

type DiceProps = {
  roll: number;
  rotated: number;
  keeped: boolean;
};

const LoadingDice = () => {
  const cbrtt = [
    "rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
    "rotateX(0deg) rotateY(-90deg) rotateZ(0deg)",
    "rotateX(-90deg) rotateY(0deg) rotateZ(0deg)",
    "rotateX(90deg) rotateY(0deg) rotateZ(0deg)",
    "rotateX(0deg) rotateY(90deg) rotateZ(0deg)",
    "rotateX(0deg) rotateY(180deg) rotateZ(0deg)",
  ];
  // const [rotate, setRotate] = useState(cbrtt[props.roll]);

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "40px" }}>
      <div className="cb01-loading">
        <div className="cbs1-loading"></div>
        <div className="cbs2-loading"></div>
        <div className="cbs3-loading"></div>
        <div className="cbs4-loading"></div>
        <div className="cbs5-loading"></div>
        <div className="cbs6-loading"></div>
      </div>
    </div>
  );
};

export default LoadingDice;
