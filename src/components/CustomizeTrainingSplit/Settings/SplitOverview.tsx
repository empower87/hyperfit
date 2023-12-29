import { useEffect, useState } from "react";
import { SplitSessionsType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
// import { SplitSessionsType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BG_COLOR_M7 } from "~/constants/themes";

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
  split_sessions: SplitSessionsType;
};
export default function SplitOverview({ split_sessions }: SplitOverviewProps) {
  const [currentSplit, setCurrentSplit] = useState<string[]>([]);

  useEffect(() => {
    let splits: string[] = [];

    Object.entries(split_sessions.sessions).map((each) => {
      if (each[1] > 0) {
        for (let i = 0; i < each[1]; i++) {
          splits.push(each[0]);
        }
      }
    });
    console.log(splits, split_sessions.sessions, "OK SOMETHING OFF HERE?");
    setCurrentSplit(splits);
  }, [split_sessions]);

  return (
    <div className=" ">
      <div className=" text-xs text-white">{SPLITS[split_sessions.split]}</div>
      <ul className=" ">
        {currentSplit.map((each, index) => {
          return (
            <SplitItem key={`${each}_SplitOverview_${index}`} split={each} />
          );
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
