import "../../style/yahtzee/LoadingDice.css";

// 参考 https://little-strange.hatenablog.com/entry/2021/11/18/224629

const LoadingDice = () => {
  return (
    <div style={{ justifyContent: "center", margin: "40px" }}>
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
