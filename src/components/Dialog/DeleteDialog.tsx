import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import { Box, SxProps } from "@mui/system";

interface DeleteDialogProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  textButtonConfirm: string;
  textButtonCancel: string;
  onConfirm: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  handleClose,
  title,
  description,
  onConfirm,
  textButtonCancel,
  textButtonConfirm,
}) => {
  const buttonStyles: SxProps = {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },

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
          width: "100%",
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
      <Box sx={buttonStyles}>
        <Button
          onClick={onConfirm}
          sx={{
            backgroundColor: "error.main",
            color: "white",
            width: { xs: "100%", sm: "150px" },
            marginRight: { xs: "0px", sm: "10px" },
          }}
        >
          <b>{textButtonConfirm}</b>
        </Button>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "text.secondary",
            color: "white",
            width: { xs: "100%", sm: "150px" },
            marginTop: { xs: "10px", sm: "0px" },
            marginLeft: { xs: "0px", sm: "10px" },
          }}
        >
          {textButtonCancel}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteDialog;
