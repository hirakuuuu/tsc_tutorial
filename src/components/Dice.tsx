import { useState } from "react";

import "../style/Dice.css";

// 参考 https://little-strange.hatenablog.com/entry/2021/11/18/224629

const Dice = () => {
  const cbrtt = [
    "rotateX(-10deg) rotateY(-10deg) rotateZ(0deg)",
    "rotateX(-10deg) rotateY(-100deg) rotateZ(0deg)",
    "rotateX(-100deg) rotateY(0deg) rotateZ(-10deg)",
    "rotateX(80deg) rotateY(0deg) rotateZ(10deg)",
    "rotateX(-10deg) rotateY(80deg) rotateZ(0deg)",
    "rotateX(-10deg) rotateY(170deg) rotateZ(0deg)",
  ];
  const [rotate, setRotate] = useState(cbrtt[0]);

  const handleClick = () => {
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
      setRotate(cbrtt[Math.floor(Math.random() * 6)]);
    }, 1500);
  };

  return (
    <div className="cb01" style={{ transform: rotate }} onClick={handleClick}>
      <div className="cbs1"></div>
      <div className="cbs2"></div>
      <div className="cbs3"></div>
      <div className="cbs4"></div>
      <div className="cbs5"></div>
      <div className="cbs6"></div>
    </div>
  );
};

export default Dice;
