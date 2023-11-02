import { useEffect, useState } from "react";
import {
  MusclePriorityType,
  SessionDayType,
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

type CellWithCounterProps = {
  mesocycle: number;
  mesoProgression: number[];
  total_sessions: [number, number];
};
function CellWithCounter({
  mesocycle,
  mesoProgression,
  total_sessions,
}: CellWithCounterProps) {
  const [canAdd, setCanAdd] = useState<boolean>(true);
  const [canSub, setCanSub] = useState<boolean>(true);
  const frequency =
    mesocycle === 1
      ? mesoProgression[0]
      : mesocycle === 2
      ? mesoProgression[1]
      : mesoProgression[2];
  const [currentValue, setCurrentValue] = useState<number>(frequency);

  const totalSessions = total_sessions[0] + total_sessions[1];
  const [minMax, setMinMax] = useState<[number, number]>([0, totalSessions]);

  useEffect(() => {
    setCurrentValue(frequency);
  }, [frequency]);

  useEffect(() => {
    const maxFrequency =
      mesocycle === 3
        ? totalSessions
        : mesocycle === 2
        ? mesoProgression[2]
        : mesoProgression[1];
    const minFrequency =
      mesocycle === 3
        ? mesoProgression[2]
        : mesocycle === 2
        ? mesoProgression[0]
        : 0;
    setMinMax([minFrequency, maxFrequency]);
  }, [totalSessions, mesocycle, mesoProgression]);

  useEffect(() => {
    if (currentValue > minMax[0]) {
      setCanSub(true);
    } else {
      setCanSub(false);
    }

    if (currentValue < minMax[1]) {
      setCanAdd(true);
    } else {
      setCanAdd(false);
    }
  }, [currentValue, minMax]);

  const onClickHandler = (type: "add" | "sub") => {
    if (type === "add") {
      setCurrentValue((prev) => prev + 1);
    } else {
      setCurrentValue((prev) => prev - 1);
    }
  };

  return (
    <div className=" flex w-1/3 justify-center">
      {canSub && (
        <button
          className={BG_COLOR_M6 + " p-1 text-xs font-bold"}
          onClick={() => onClickHandler("sub")}
        >
          -
        </button>
      )}

      <div className={" text-xxs p-1"}>{currentValue}</div>
      {canAdd && (
        <button
          className={BG_COLOR_M6 + " p-1 text-xs font-bold"}
          onClick={() => onClickHandler("add")}
        >
          +
        </button>
      )}
    </div>
  );
}

type ItemProps = {
  muscleGroup: MusclePriorityType;
  index: number;
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
  total_sessions: [number, number];
};
function Item({
  muscleGroup,
  index,
  onVolumeChange,
  total_sessions,
}: ItemProps) {
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

      <div className=" flex w-2/12 justify-evenly">
        <Select
          volume_landmark={muscleGroup.volume_landmark}
          options={["MRV", "MEV", "MV"]}
          onSelect={onSelectHandler}
          bgColor={bgColor}
        />
        <div className=" ">{volumeSets}</div>
      </div>

      <div className=" flex w-3/12">
        <CellWithCounter
          mesocycle={1}
          mesoProgression={muscleGroup.mesoProgression}
          total_sessions={total_sessions}
        />
        <CellWithCounter
          mesocycle={2}
          mesoProgression={muscleGroup.mesoProgression}
          total_sessions={total_sessions}
        />
        <CellWithCounter
          mesocycle={3}
          mesoProgression={muscleGroup.mesoProgression}
          total_sessions={total_sessions}
        />
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

type MusclePriorityListProps = {
  musclePriority: MusclePriorityType[];
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
  total_sessions: [number, number];
};

export function MusclePriorityList({
  musclePriority,
  onVolumeChange,
  total_sessions,
}: MusclePriorityListProps) {
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
              total_sessions={total_sessions}
            />
          );
        })}
      </ul>
    </div>
  );
}

const editMesocycleFrequencyHandler = (
  _split: SessionDayType[],
  _total_sessions: [number, number],
  _frequency: number,
  _muscle: MusclePriorityType,
  _mesocycle: number
) => {
  const totalSessions = _total_sessions[0] + _total_sessions[1];
  const { mesoProgression } = _muscle;
  const maxFrequency =
    _mesocycle === 3
      ? totalSessions
      : _mesocycle === 2
      ? mesoProgression[2]
      : mesoProgression[1];
  const minFrequency =
    _mesocycle === 3
      ? mesoProgression[2]
      : _mesocycle === 2
      ? mesoProgression[0]
      : 0;
};
