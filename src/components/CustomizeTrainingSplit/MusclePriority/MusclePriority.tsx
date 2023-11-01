import {
  MusclePriorityType,
  VOLUME_BG_COLORS,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { VolumeLandmarkType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
import {
  getEndOfMesocycleVolume,
  getVolumeSets,
} from "~/utils/musclePriorityHandlers";
import { BG_COLOR_M5, BG_COLOR_M6, BORDER_COLOR_M8 } from "~/utils/themes";

type SelectProps = {
  volume_landmark: VolumeLandmarkType;
  options: ["MRV", "MEV", "MV"];
  onSelect: (value: string) => void;
  bgColor: string;
};

function Select({ volume_landmark, options, onSelect, bgColor }: SelectProps) {
  const onSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  return (
    <select
      className={bgColor + " text-xxs font-bold text-white"}
      onChange={onSelectHandler}
    >
      {options.map((each) => {
        return (
          <option
            key={each}
            className={
              volume_landmark === each ? BG_COLOR_M5 : BG_COLOR_M6 + " "
            }
            value={each}
            selected={volume_landmark === each ? true : false}
          >
            {each}
          </option>
        );
      })}
    </select>
  );
}

type CellProps = {
  value: string | number;
  width: string;
};

function Cell({ value, width }: CellProps) {
  return <div className=" w-1/12 indent-1">{value}</div>;
}

type ItemProps = {
  muscleGroup: MusclePriorityType;
  index: number;
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
};
function Item({ muscleGroup, index, onVolumeChange }: ItemProps) {
  const { mesoProgression, volume_landmark, muscle } = muscleGroup;
  const volumeSets = getVolumeSets(muscle, mesoProgression[2], volume_landmark);
  const mesoOneVolume = getEndOfMesocycleVolume(
    muscle,
    mesoProgression[0],
    volume_landmark
  );
  const mesoTwoVolume = getEndOfMesocycleVolume(
    muscle,
    mesoProgression[1],
    volume_landmark
  );
  const mesoThreeVolume = getEndOfMesocycleVolume(
    muscle,
    mesoProgression[2],
    volume_landmark
  );
  const bgColor = VOLUME_BG_COLORS[muscleGroup.volume_landmark];

  const onSelectHandler = (value: string) => {
    onVolumeChange(index, value as VolumeLandmarkType);
  };

  return (
    <li className={bgColor + " text-xxs mb-0.5 flex p-0.5 text-white"}>
      <div className=" w-1/12 indent-1">{index + 1}</div>

      <div className=" w-3/12 indent-1">{muscleGroup.muscle}</div>

      <div className=" flex w-2/12">
        <div className=" ">{volumeSets}</div>
        <Select
          volume_landmark={muscleGroup.volume_landmark}
          options={["MRV", "MEV", "MV"]}
          onSelect={onSelectHandler}
          bgColor={bgColor}
        />
      </div>

      <div className=" flex w-3/12">
        <div className=" flex w-1/3 justify-center">
          {muscleGroup.mesoProgression[0]}
        </div>
        <div className=" flex w-1/3 justify-center">
          {muscleGroup.mesoProgression[1]}
        </div>
        <div className=" flex w-1/3 justify-center">
          {muscleGroup.mesoProgression[2]}
        </div>
      </div>

      <div className=" flex w-3/12">
        <div className=" flex w-1/3 justify-center">{mesoOneVolume}</div>
        <div className=" flex w-1/3 justify-center">{mesoTwoVolume}</div>
        <div className=" flex w-1/3 justify-center">{mesoThreeVolume}</div>
      </div>
      {/* <div className=" flex w-1/12 justify-center">{totalVolume}</div> */}
    </li>
  );
}

type MusclePriorityProps = {
  musclePriority: MusclePriorityType[];
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
};

export function MusclePriority({
  musclePriority,
  onVolumeChange,
}: MusclePriorityProps) {
  return (
    <div className=" w-3/4">
      <div className={BG_COLOR_M6 + " text-xxs mb-1 flex text-white"}>
        <div className={BORDER_COLOR_M8 + " w-1/12 border-r-2 indent-1"}>
          Rank
        </div>
        <div className={BORDER_COLOR_M8 + " w-3/12 border-r-2 indent-1"}>
          Group
        </div>
        <div
          className={BORDER_COLOR_M8 + " flex w-2/12 border-r-2 text-center"}
        >
          Volume Benchmark
        </div>
        <div className={BORDER_COLOR_M8 + " flex w-3/12 flex-col border-r-2"}>
          <div className=" mb-0.5 flex justify-center">Mesocycle Frequency</div>
          <div className=" flex">
            <div className=" flex w-1/3 justify-center">1</div>
            <div className=" flex w-1/3 justify-center">2</div>
            <div className=" flex w-1/3 justify-center">3</div>
          </div>
        </div>
        <div className={BORDER_COLOR_M8 + " flex w-3/12 flex-col border-r-2"}>
          <div className=" mb-0.5 flex justify-center">
            Mesocycle Total Vol.
          </div>
          <div className=" flex">
            <div className=" flex w-1/3 justify-center">1</div>
            <div className=" flex w-1/3 justify-center">2</div>
            <div className=" flex w-1/3 justify-center">3</div>
          </div>
        </div>
        {/* <div className=" flex w-1/12">Total Volume</div> */}
      </div>

      <ul className=" flex flex-col">
        {musclePriority.map((each, index) => {
          return (
            <Item
              key={`${each.id}_MusclePriority`}
              muscleGroup={each}
              index={index}
              onVolumeChange={onVolumeChange}
            />
          );
        })}
      </ul>
    </div>
  );
}
