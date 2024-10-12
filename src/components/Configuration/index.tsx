import { ReactNode } from "react";
import Actions from "./components/Actions";
import MusclePrioritization from "./components/MusclePrioritization/MusclePrioritization";
import Frequency from "./components/Periodization/Frequency";
import Periodization from "./components/Periodization/Periodization";
import SplitOverview from "./components/Split/SplitOverview";

export default function Configuration({ children }: { children: ReactNode }) {
  return (
    <div id="configuration" className={`flex flex-col space-x-1 sm:flex-row`}>
      {children}
    </div>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return <div className={`flex flex-col space-y-3`}>{children}</div>;
}

Configuration.Actions = Actions;
Configuration.Layout = Layout;
Configuration.Frequency = Frequency;
Configuration.Split = SplitOverview;
Configuration.SplitSelect = SplitOverview.SplitSelect;
Configuration.SplitWeek = SplitOverview.SplitWeek;
Configuration.Periodization = Periodization;
Configuration.MusclePrioritization = MusclePrioritization;
