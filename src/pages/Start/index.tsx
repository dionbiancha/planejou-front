import { useState } from "react";
import Goal from "./Goal";
import { Step } from "../../types";
import Date from "./Date";
import Objetive from "./Objetive";

export default function Start() {
  const [step, setStep] = useState<Step>(Step.Goal);

  return (
    <>
      {step === Step.Goal && <Goal handleStep={setStep} />}
      {step === Step.Date && <Date handleStep={setStep} />}
      {step === Step.Objective && <Objetive handleStep={setStep} />}
    </>
  );
}
