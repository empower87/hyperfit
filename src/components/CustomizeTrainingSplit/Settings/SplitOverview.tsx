import { useState } from "react";
import { MusclePriorityType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BG_COLOR_M7 } from "~/utils/themes";

const PPLUL = ["push", "pull", "lower", "upper", "lower"];
const PPL = ["push", "pull", "lower"];
const BRO = ["chest", "back", "lower", "arms", "shoulders"];
const UL = ["upper", "lower", "upper", "lower"];
const FB = ["full", "full", "full"];

// TODO: Looks like this should be in base reducer as an option to
//       determine frequency in the muscleprioritylist. Default will obviously
//       be the logic to determine best frequency.

// TODO: add customization

// Optimize for Frequency (default)
// Allow for pure split

const SPLITS = {
  OPT: "optimized",
  CUS: "custom",
  PPL: "push / pull / legs",
  UL: "upper / lower",
  BRO: "bro",
  PPLUL: "push / pull / legs - upper / lower",
  FB: "full body",
};

const getSplitList = () => {};

export default function SplitOverview() {
  const [currentSplit, setCurrentSplit] = useState<string[]>([]);

  return (
    <div className=" ">
      <div className=" text-xs text-white">Training Splits</div>
      <ul className=" ">
        {Object.values(SPLITS).map((each) => {
          return <SplitItem value={each} />;
        })}
      </ul>
    </div>
  );
}

type SplitItemProps = {
  value: string;
};

function SplitItem({ value }: SplitItemProps) {
  return (
    <li className={BG_COLOR_M7 + " text-xxs mb-1 indent-1 text-white"}>
      {value}
    </li>
  );
}

const useCustomizableSplit = (
  total_sessions: [number, number],
  musclePriority: MusclePriorityType[]
) => {};
