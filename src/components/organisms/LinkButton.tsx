import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

type ButtonProps = {
  to: string;
  title: string;
};

const LinkButton = (props: ButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to={props.to}
      style={{ marginRight: "20px" }}
    >
      {props.title}
    </Button>
  );
};

export default LinkButton;
