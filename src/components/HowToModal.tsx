import { Button, Modal, Paper } from "@material-ui/core";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400",
  backgroundColor: "#ffffff",
  boxShadow: "24",
  padding: "20px",
};

type ModalProps = {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  content: JSX.Element;
};

const HowToModal = (props: ModalProps) => {
  return (
    <div>
      <Button onClick={props.handleOpen}>遊び方</Button>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper elevation={2} style={style}>
          {props.content}
        </Paper>
      </Modal>
    </div>
  );
};

export default HowToModal;
