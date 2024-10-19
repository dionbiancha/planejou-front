import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

interface BorderLinearProgressProps {
  rtl?: boolean;
  value: number;
}

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "rtl",
})<BorderLinearProgressProps>(({ theme, rtl, value }) => ({
  height: 10,
  borderRadius: 5,
  transform: rtl ? "rotateY(180deg)" : "none",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: value < 50 && rtl ? "yellow" : "#05c26a",
    ...theme.applyStyles("dark", {
      backgroundColor: value < 50 && rtl ? "yellow" : "#05c26a",
    }),
  },
}));

export default BorderLinearProgress;
