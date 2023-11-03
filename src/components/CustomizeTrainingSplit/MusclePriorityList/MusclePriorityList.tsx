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

const useFrequencyEditor = (
  mesoProgression: number[],
  total: [number, number]
) => {
  const [canAddList, setCanAddList] = useState<boolean[]>([true, true, true]);
  const [canSubList, setCanSubList] = useState<boolean[]>([true, true, true]);
  const [currentMesoProgression, setCurrentMesoProgression] = useState<
    number[]
  >([...mesoProgression]);

  const canAddHandler = (mesoProgression: number[], max: number) => {
    const canAdds: boolean[] = [];
    for (let i = 0; i < mesoProgression.length; i++) {
      const currentElement = mesoProgression[i];
      const nextElement = mesoProgression[i + 1];

      if (nextElement) {
        if (currentElement < nextElement) {
          canAdds.push(true);
        } else {
          canAdds.push(false);
        }
      } else {
        if (currentElement < max) {
          canAdds.push(true);
        } else {
          canAdds.push(false);
        }
      }
    }
    return canAdds;
  };

  const canSubHandler = (mesoProgression: number[]) => {
    const canSubs: boolean[] = [];
    for (let i = 0; i < mesoProgression.length; i++) {
      const currentElement = mesoProgression[i];
      const prevElement = mesoProgression[i - 1];

      if (prevElement) {
        if (currentElement > prevElement) {
          canSubs.push(true);
        } else {
          canSubs.push(false);
        }
      } else {
        if (currentElement > 0) {
          canSubs.push(true);
        } else {
          canSubs.push(false);
        }
      }
    }
    return canSubs;
  };

  const onAddSubHandler = (type: "add" | "sub", mesocycle: number) => {
    const mesocycleIndex = mesocycle - 1;
    let mesoProg = [...currentMesoProgression];

    let newValue = mesoProg[mesocycleIndex] + 1;
    if (type === "sub") {
      newValue = mesoProg[mesocycleIndex] - 1;
    }
    mesoProg[mesocycleIndex] = newValue;

    setCurrentMesoProgression(mesoProg);
  };

  const onCancelHandler = () => {
    setCurrentMesoProgression([...mesoProgression]);
  };

  const onSaveHandler = () => {
    console.log("saved");
  };

  useEffect(() => {
    const max = total[0] + total[1];
    const addBools = canAddHandler(currentMesoProgression, max);
    const subBools = canSubHandler(currentMesoProgression);
    setCanAddList(addBools);
    setCanSubList(subBools);
  }, [currentMesoProgression]);

  return {
    canAddList,
    canSubList,
    onAddSubHandler,
    currentMesoProgression,
  };
};

type CellWithCounterProps = {
  mesocycle: number;
  currentValue: number;
  canAdd: boolean;
  canSub: boolean;
  onAddSubtract: (type: "add" | "sub", mesocycle: number) => void;
};
function CellWithCounter({
  mesocycle,
  currentValue,
  canAdd,
  canSub,
  onAddSubtract,
}: CellWithCounterProps) {
  return (
    <div className=" mr-2 flex items-center justify-center">
      <button
        className={BG_COLOR_M6 + " h-4 w-4 text-xs font-bold"}
        onClick={() => onAddSubtract("sub", mesocycle)}
        disabled={!canSub}
      >
        -
      </button>
      <div className={" text-xxs p-1"}>{currentValue}</div>
      <button
        className={BG_COLOR_M6 + " h-4 w-4 text-xs font-bold"}
        onClick={() => onAddSubtract("add", mesocycle)}
        disabled={!canAdd}
      >
        +
      </button>
    </div>
  );
}

type EditMesocycleFrequencyProps = {
  mesoProgression: number[];
  total_sessions: [number, number];
  onEdit: () => void;
};
function EditMesocycleFrequency({
  mesoProgression,
  total_sessions,
  onEdit,
}: EditMesocycleFrequencyProps) {
  const { canAddList, canSubList, onAddSubHandler, currentMesoProgression } =
    useFrequencyEditor(mesoProgression, total_sessions);

  const cancel = () => {
    onEdit();
  };

  const save = () => {
    onEdit();
  };
  return (
    <div className=" flex w-6/12">
      <CellWithCounter
        mesocycle={1}
        currentValue={currentMesoProgression[0]}
        canAdd={canAddList[0]}
        canSub={canSubList[0]}
        onAddSubtract={onAddSubHandler}
      />
      <CellWithCounter
        mesocycle={2}
        currentValue={currentMesoProgression[1]}
        canAdd={canAddList[1]}
        canSub={canSubList[1]}
        onAddSubtract={onAddSubHandler}
      />
      <CellWithCounter
        mesocycle={3}
        currentValue={currentMesoProgression[2]}
        canAdd={canAddList[2]}
        canSub={canSubList[2]}
        onAddSubtract={onAddSubHandler}
      />
      <div className=" flex items-center">
        <button
          className={BG_COLOR_M5 + " mr-1 h-4 w-4 rounded-full font-bold"}
          onClick={cancel}
        >
          x
        </button>
        <button
          className={"h-4 w-4 rounded-full bg-blue-600 font-bold"}
          onClick={save}
        >
          ok
        </button>
      </div>
    </div>
  );
}

function MesocycleFrequency({
  mesoProgression,
  onEdit,
}: {
  mesoProgression: number[];
  onEdit: () => void;
}) {
  return (
    <div className=" flex w-4/12">
      <div className=" flex w-1/3 justify-center">{mesoProgression[0]}</div>
      <div className=" flex w-1/3 justify-center">{mesoProgression[1]}</div>
      <div className=" flex w-1/3 justify-center">{mesoProgression[2]}</div>
      <button className="  bg-blue-600 pl-1 pr-1" onClick={onEdit}>
        edit
      </button>
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
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

  const onEditHandler = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <li className={bgColor + " text-xxs mb-0.5 flex p-0.5 text-white"}>
      <div className=" w-1/12 indent-1">{index + 1}</div>

      <div className=" w-2/12 indent-1">{muscleGroup.muscle}</div>

      <div className=" flex w-2/12 justify-evenly">
        <Select
          volume_landmark={muscleGroup.volume_landmark}
          options={["MRV", "MEV", "MV"]}
          onSelect={onSelectHandler}
          bgColor={bgColor}
        />
        <div className=" ">{volumeSets}</div>
      </div>

      {isEditing ? (
        <EditMesocycleFrequency
          mesoProgression={mesoProgression}
          total_sessions={total_sessions}
          onEdit={onEditHandler}
        />
      ) : (
        <MesocycleFrequency
          mesoProgression={mesoProgression}
          onEdit={onEditHandler}
        />
      )}

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
        <div className={BORDER_COLOR_M8 + " w-2/12 border-r-2 indent-1"}>
          Group
        </div>
        <div
          className={BORDER_COLOR_M8 + " flex w-2/12 border-r-2 text-center"}
        >
          Volume Benchmark
        </div>
        <div className={BORDER_COLOR_M8 + " flex w-4/12 flex-col border-r-2"}>
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
