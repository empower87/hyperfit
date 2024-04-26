import { ReactNode } from "react";
import Frequency from "./components/Periodization/Frequency";
import Periodization from "./components/Periodization/Periodization";
import Split from "./components/Split/SplitSelect";
import { ProgramConfigProvider } from "./hooks/useProgramConfig";

Configuration.Frequency = Frequency;
Configuration.Split = Split;
Configuration.Periodization = Periodization;
export default function Configuration({ children }: { children: ReactNode }) {
  return (
    <ProgramConfigProvider>
      <div id="configuration" className="mb-5 flex w-full space-x-1">
        {children}
      </div>
    </ProgramConfigProvider>
  );
}
