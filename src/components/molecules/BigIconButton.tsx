import React from "react";
import { Button } from "@material-ui/core";

type Props = {
  value: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  buttonText: string;
  icon: JSX.Element;
};

const BigIconButton = (props: Props) => {
  const { value, onClick, buttonText, icon } = props;
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      style={{ margin: "10px" }}
      disabled={!value}
    >
      <div style={{ textAlign: "center" }}>
        {icon}
        <div>{buttonText}</div>
      </div>
    </Button>
  );
};

export default BigIconButton;
