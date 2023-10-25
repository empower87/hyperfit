import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { MusclePriorityType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BG_COLOR_M6 } from "~/utils/themes";

function Item({
  muscleGroup,
  index,
}: {
  muscleGroup: MusclePriorityType;
  index: number;
}) {
  const bgColor =
    index < MRV_RANK
      ? "bg-red-500"
      : index >= MRV_RANK && index < MEV_RANK
      ? "bg-orange-400"
      : "bg-green-400";
  const volume =
    index < MRV_RANK
      ? "MRV"
      : index >= MRV_RANK && index < MEV_RANK
      ? "MEV"
      : "MV";
  return (
    <li className={bgColor + " text-xxs mb-0.5 flex p-0.5"}>
      <div className=" w-1/12 indent-1">{index + 1}</div>
      <div className=" w-6/12 indent-1">{muscleGroup.muscle}</div>
      <div className=" flex w-2/12 justify-center">{volume}</div>
      <div className=" flex w-1/12 justify-center">
        {muscleGroup.mesoProgression[0]}
      </div>
      <div className=" flex w-1/12 justify-center">
        {muscleGroup.mesoProgression[1]}
      </div>
      <div className=" flex w-1/12 justify-center">
        {muscleGroup.mesoProgression[2]}
      </div>
    </li>
  );
}

type MusclePriorityProps = {
  list: MusclePriorityType[];
};

export function MusclePriority({ list }: MusclePriorityProps) {
  return (
    <div>
      <div className={BG_COLOR_M6 + " text-xxs mb-1 flex text-white"}>
        <div className=" w-1/12 border-r-2 border-slate-800 indent-1">Rank</div>
        <div className=" w-6/12 border-r-2 border-slate-800 indent-1">
          Group
        </div>
        <div className=" w-2/12 border-r-2 border-slate-800 indent-1">
          Volume Indicator
        </div>
        <div className=" flex w-3/12 flex-col">
          <div className=" mb-0.5 flex justify-center">Mesocycle Frequency</div>
          <div className=" flex">
            <div className=" flex w-1/3 justify-center">1</div>
            <div className=" flex w-1/3 justify-center">2</div>
            <div className=" flex w-1/3 justify-center">3</div>
          </div>
        </div>
      </div>
      <ul className=" flex flex-col">
        {list.map((each, index) => {
          return <Item muscleGroup={each} index={index} />;
        })}
      </ul>
    </div>
  );
}
