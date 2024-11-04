import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Stack } from "@mui/material";
import CustomButton from "../Button/CustomButton";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface MediaProps {
  title: string;
  description: string;
  media: string;
}

type MediaDialogProps = {
  media: MediaProps[]; // Array de URLs de imagens ou GIFs
  open: boolean;
};

export default function MediaDialog({ media, open }: MediaDialogProps) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { t } = useTranslation();

  const handleClose = () => {
    setOpenDialog(false);
    setCurrentIndex(0); // Reset para a primeira mídia ao fechar
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  React.useEffect(() => {
    setOpenDialog(open);
  }, [open]);

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="media-dialog-description"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "15px", // Ajuste o valor conforme necessário
        },
      }}
    >
      <DialogContent>
        <img
          src={media[currentIndex].media}
          alt={`Mídia ${currentIndex + 1}`}
          style={{ maxWidth: "500px", height: "auto", width: "100%" }}
        />
        <h2 id="media-dialog-description">{t(media[currentIndex].title)}</h2>
        <p>{t(media[currentIndex].description)}</p>
      </DialogContent>
      {media.length !== 1 && (
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          padding={2}
        >
          {media.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                mx: "3px",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor:
                  index === currentIndex ? "primary.main" : "grey.400",
                cursor: "pointer",
              }}
            />
          ))}
        </Stack>
      )}

      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        padding={2}
      >
        <CustomButton
          onClick={media.length === 1 ? handleClose : handleNext}
          variant="contained"
          borderRadius={2}
          size="large"
          label={media.length === 1 ? t("Entendi") : t("Próximo")}
        />
      </Stack>
    </Dialog>
  );
}
