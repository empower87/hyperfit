import { useState } from "react";
import {
  MusclePriorityType,
  SplitSessionsNameType,
  SplitSessionsType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getSplitOverview } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
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
  const data = getSplitOverview(split);
  console.log(data, "WHAT THIS LOOK LIKE??");
  return (
    <div className=" ">
      <div className=" text-xs text-white">{SPLITS[split.name]}</div>
      <ul className=" ">
        {Object.entries(SPLITS).map((each) => {
          const sessionSplitKey = each[0] as SplitSessionsNameType;
          return (
            <SplitItem
              key={`${each}_SplitOverview`}
              sessionSplitKey={sessionSplitKey}
              sessionSplitValue={each[1]}
              // onSplitChange={onSplitChange}
            />
          );
        })}
      </ul>
    </div>
  );
}

type SplitItemProps = {
  sessionSplitKey: SplitSessionsNameType;
  sessionSplitValue: string;

  // onSplitChange: (type: SplitSessionsNameType) => void;
};

function SplitItem({
  sessionSplitKey,
  sessionSplitValue,
}: // onSplitChange,
SplitItemProps) {
  const [values, setValues] = useState<string[]>([]);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const onClickHandler = () => {
    // onSplitChange(sessionSplitKey);

    // let values: string[] = [];
    // if (actualSplit) {
    //   Object.entries(actualSplit).map((each) => {
    //     let total = each[1];
    //     while (total > 0) {
    //       values.push(each[0]);
    //       total--;
    //     }
    //   });
    // }
    // setValues(values);

    setIsClicked((prev) => !prev);
  };

  return (
    <li
      className={BG_COLOR_M7 + " text-xxs mb-1 indent-1 text-white"}
      onClick={onClickHandler}
    >
      {sessionSplitValue}
      {isClicked && values.length && <ExpandedSplit values={values} />}
    </li>
  );
}

type ExpandedSplitProps = {
  values: string[];
};

function ExpandedSplit({ values }: ExpandedSplitProps) {
  return (
    <div className=" text-xxs">
      {values.map((each) => {
        return <div>{each}</div>;
      })}
    </div>
  );
}

const useCustomizableSplit = (
  total_sessions: [number, number],
  musclePriority: MusclePriorityType[]
) => {};
