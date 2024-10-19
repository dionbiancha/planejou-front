export enum Step {
  Goal,
  Date,
}

export interface StartProps {
  handleStep: (step: Step) => void;
}
