import { ReactNode } from "react";
import Actions from "./components/Actions";
import MusclePrioritization from "./components/MusclePrioritization/MusclePrioritization";
import Frequency from "./components/Periodization/Frequency";
import Periodization from "./components/Periodization/Periodization";
import SplitOverview from "./components/Split/SplitOverview";
import { ProgramConfigProvider } from "./hooks/useProgramConfig";

export default function Configuration({ children }: { children: ReactNode }) {
  return (
    <ProgramConfigProvider>
      <div id="configuration" className="mb-5 flex h-full w-full space-x-1">
        {children}
      </div>
    </ProgramConfigProvider>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return <div className={`flex flex-col space-y-1`}>{children}</div>;
}

Configuration.Actions = Actions;
Configuration.Layout = Layout;
Configuration.Frequency = Frequency;
Configuration.Split = SplitOverview;
Configuration.Periodization = Periodization;
Configuration.MusclePrioritization = MusclePrioritization;
