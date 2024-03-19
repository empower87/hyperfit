import { ReactNode } from "react";
import Frequency from "./Frequency";
import Periodization from "./Periodization";
import Split from "./SplitSelect";
import { ProgramConfigProvider } from "./hooks/useProgramConfig";

ProgramConfig.Frequency = Frequency;
ProgramConfig.Split = Split;
ProgramConfig.Periodization = Periodization;
export default function ProgramConfig({ children }: { children: ReactNode }) {
  return (
    <ProgramConfigProvider>
      <div className="mb-5 flex w-full justify-center space-x-2">
        {children}
      </div>
    </ProgramConfigProvider>
  );
}
