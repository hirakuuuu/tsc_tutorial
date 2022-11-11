import { Button } from "@material-ui/core";

type ButtonProps = {
  onClick: () => void;
  title: string;
};

const GameButton = (props: ButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={props.onClick}
      style={{ marginRight: "20px" }}
    >
      {props.title}
    </Button>
  );
};

export default GameButton;
