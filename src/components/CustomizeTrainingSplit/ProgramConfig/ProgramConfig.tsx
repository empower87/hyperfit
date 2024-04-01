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
      <div id="configuration" className="mb-5 flex w-full space-x-1">
        {children}
      </div>
    </ProgramConfigProvider>
  );
}
