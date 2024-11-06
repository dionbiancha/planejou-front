import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/system";
import { useLoading } from "../../context/LoadingContext/useLoading";

interface GenericDialogProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  textButtonConfirm: string;
  textButtonCancel: string;
  onConfirm: () => void;
}

const GenericDialog: React.FC<GenericDialogProps> = ({
  open,
  handleClose,
  title,
  description,
  onConfirm,
  textButtonCancel,
  textButtonConfirm,
}) => {
  const loading = useLoading();
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
          disabled={loading.state}
          onClick={onConfirm}
          autoFocus
          sx={{ backgroundColor: "error.main", color: "white" }}
        >
          <b>{textButtonConfirm}</b>
        </Button>
        <Button
          disabled={loading.state}
          onClick={handleClose}
          sx={{ backgroundColor: "text.secondary", color: "white" }}
        >
          <b>{textButtonCancel}</b>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericDialog;
