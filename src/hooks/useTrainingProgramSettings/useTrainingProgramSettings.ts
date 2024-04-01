import { useState } from "react";

export default function useTrainingProgramSettings() {
  const [state, setState] = useState(0);
  return {
    state,
  };
}
