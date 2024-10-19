import * as React from "react";
import { Snackbar, Alert, AlertTitle, useTheme } from "@mui/material";
import { useSnack } from "../../context/SnackContext";

const Snack = () => {
  const theme = useTheme();
  const snack = useSnack();
  const handleClose = () => {
    snack.hide();
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    handleClose();
  };

  function color() {
    if (snack.snackData.type === "success") {
      return theme.palette.success.main;
    }
    if (snack.snackData.type === "error") {
      return theme.palette.error.main;
    }
    if (snack.snackData.type === "warning") {
      return theme.palette.warning.main;
    }
    if (snack.snackData.type === "info") {
      return theme.palette.info.main;
    }
  }

  if (!snack.snackData.state) return <></>;

  return (
    <Snackbar
      open={snack.snackData.state}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
    >
      <Alert
        onClose={handleClose}
        severity={snack.snackData.type}
        variant="filled"
        sx={{
          width: "100%",
          color: "white",
          backgroundColor: `${color()} !important`,
        }}
      >
        <AlertTitle>{snack.snackData.title}</AlertTitle>
      </Alert>
    </Snackbar>
  );
};

export default Snack;
