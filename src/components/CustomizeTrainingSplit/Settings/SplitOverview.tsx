import { useEffect, useState } from "react";
import { SplitSessionsType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
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

type SplitOverviewProps = {
  split: SplitSessionsType;
};
export default function SplitOverview({ split }: SplitOverviewProps) {
  const [currentSplit, setCurrentSplit] = useState<string[]>([]);

  useEffect(() => {
    let splits: string[] = [];

    Object.entries(split.sessions).map((each) => {
      if (each[1] > 0) {
        for (let i = 0; i < each[1]; i++) {
          splits.push(each[0]);
        }
      }
    });
    console.log(splits, split.sessions, "OK SOMETHING OFF HERE?");
    setCurrentSplit(splits);
  }, [split]);

  return (
    <div className=" ">
      <div className=" text-xs text-white">{SPLITS[split.name]}</div>
      <ul className=" ">
        {currentSplit.map((each) => {
          return <SplitItem key={`${each}_SplitOverview`} split={each} />;
        })}
      </ul>
    </div>
  );
}

type SplitItemProps = {
  split: string;
};

function SplitItem({ split }: SplitItemProps) {
  const [values, setValues] = useState<string[]>([]);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  return (
    <li className={BG_COLOR_M7 + " text-xxs mb-1 indent-1 text-white"}>
      {split}
    </li>
  );
}
