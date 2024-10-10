export enum Step {
  Goal,
  Date,
  Objective,
}

export interface StartProps {
  handleStep: (step: Step) => void;
}
