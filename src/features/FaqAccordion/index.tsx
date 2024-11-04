import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";

interface FaqAccordionItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqAccordionItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const { t } = useTranslation();
  return (
    <List sx={{ maxWidth: "800px", width: "100%" }}>
      {items.map((item, index) => (
        <ListItem key={index} disableGutters>
          <Accordion
            square={true}
            sx={{
              width: "100%",
              boxShadow: "none",
              borderRadius: "15px",
            }}
          >
            <AccordionSummary
              sx={{ width: "100%" }}
              expandIcon={<AddIcon color="primary" />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6">{t(item.question)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{t(item.answer)}</Typography>
            </AccordionDetails>
          </Accordion>
        </ListItem>
      ))}
    </List>
  );
};

export default FaqAccordion;
