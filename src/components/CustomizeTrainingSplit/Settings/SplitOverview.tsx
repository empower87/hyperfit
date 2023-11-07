import { useState } from "react";
import { MusclePriorityType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { selectSplitHandler } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
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

export default function SplitOverview({
  total_sessions,
}: {
  total_sessions: [number, number];
}) {
  const [currentSplit, setCurrentSplit] = useState<string[]>([]);

  return (
    <div className=" ">
      <div className=" text-xs text-white">Training Splits</div>
      <ul className=" ">
        {Object.values(SPLITS).map((each) => {
          return <SplitItem value={each} total_sessions={total_sessions} />;
        })}
      </ul>
    </div>
  );
}

type SplitItemProps = {
  value: string;
  total_sessions: [number, number];
};

function SplitItem({ value, total_sessions }: SplitItemProps) {
  const [values, setValues] = useState<string[]>([]);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const onClickHandler = () => {
    const getValues = selectSplitHandler(value, total_sessions);
    setValues(getValues);

    setIsClicked((prev) => !prev);
  };

  return (
    <li
      className={BG_COLOR_M7 + " text-xxs mb-1 indent-1 text-white"}
      onClick={onClickHandler}
    >
      {value}
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
