import { useEffect, useState } from "react";

import "../../../style/yahtzee/Dice.css";

// 参考 https://little-strange.hatenablog.com/entry/2021/11/18/224629

type DiceProps = {
  roll: number;
  rotated: number;
  keeped: boolean;
};

const Dice = (props: DiceProps) => {
  const cbrtt = [
    "rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
    "rotateX(0deg) rotateY(-90deg) rotateZ(0deg)",
    "rotateX(-90deg) rotateY(0deg) rotateZ(0deg)",
    "rotateX(90deg) rotateY(0deg) rotateZ(0deg)",
    "rotateX(0deg) rotateY(90deg) rotateZ(0deg)",
    "rotateX(0deg) rotateY(180deg) rotateZ(0deg)",
  ];
  const [rotate, setRotate] = useState(cbrtt[props.roll]);

  useEffect(() => {
    if (props.rotated > 0 && !props.keeped) {
      setRotate(
        "rotateX(" +
          (800 + 200 * Math.random()) +
          "deg) rotateY(" +
          (50 + 100 * Math.random()) +
          "deg) rotateZ(" +
          (50 + 100 * Math.random()) +
          "deg)"
      );
      setTimeout(() => {
        setRotate(cbrtt[props.roll]);
      }, 1500);
    }
  }, [props.rotated]);

  return (
    <div className={props.keeped ? "keeped-dice" : ""}>
      <div
        className="cb01"
        style={{
          transform: rotate,
        }}
      >
        <div className="cbs1"></div>
        <div className="cbs2"></div>
        <div className="cbs3"></div>
        <div className="cbs4"></div>
        <div className="cbs5"></div>
        <div className="cbs6"></div>
      </div>
    </div>
  );
};

export default Dice;
