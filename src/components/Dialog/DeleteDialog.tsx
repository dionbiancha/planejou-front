import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/system";

interface DeleteDialogProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  textButtonConfirm: string;
  textButtonCancel: string;
  onConfirm: () => void;
  objetive: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  handleClose,
  title,
  description,
  onConfirm,
  textButtonCancel,
  textButtonConfirm,
  objetive,
}) => {
  const buttonStyles: SxProps = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ textAlign: "center" }}
      PaperProps={{
        sx: {
          padding: "20px",
          borderRadius: "15px", // Aumente o valor conforme necessário
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <b>{title}</b>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={buttonStyles}>
        <Button
          onClick={onConfirm}
          autoFocus
          sx={{ backgroundColor: "error.main", color: "white" }}
        >
          {textButtonConfirm}&nbsp;<b>{objetive}</b>
        </Button>
        <Button
          onClick={handleClose}
          sx={{ backgroundColor: "text.secondary", color: "white" }}
        >
          <b>{textButtonCancel}</b>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
