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

interface FaqAccordionItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqAccordionItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
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
              <Typography variant="h6">{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        </ListItem>
      ))}
    </List>
  );
};

export default FaqAccordion;
