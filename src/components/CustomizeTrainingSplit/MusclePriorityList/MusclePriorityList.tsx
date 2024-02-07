import {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { BG_COLOR_M5, BG_COLOR_M6, BORDER_COLOR_M8 } from "~/constants/themes";
import {
  MusclePriorityType,
  SplitSessionsType,
  VOLUME_BG_COLORS,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getVolumeSets } from "~/utils/musclePriorityHandlers";
import MesocycleFrequency from "./components/MesocycleFrequency";
import { MesocycleVolumes } from "./components/MesocycleVolumes";
import useMusclePriority from "./hooks/useMusclePriority";
import { getEndOfMesocycleVolume } from "./utils/getVolumeTotal";

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
            selected={volume_landmark === each}
          >
            {each}
          </option>
        );
      })}
    </select>
  );
}

// const CELL_WIDTHS = [" w-1/12", " w-2/12", " w-2/12", " w-4/12", " w-3/12"];
// const CELL_WIDTHS_ON_EDIT = [
//   " w-1/12",
//   " w-1/12",
//   " w-2/12",
//   " w-6/12",
//   " w-2/12",
// ];

const CELL_WIDTHS = ["5%", "20%", "20%", "30%", "25%"];
const CELL_WIDTHS_ON_EDIT = ["5%", "15%", "20%", "40%", "20%"];

type ItemProps = {
  muscleGroup: MusclePriorityType;
  index: number;
  onVolumeChange: (
    id: MusclePriorityType["id"],
    volume_landmark: VolumeLandmarkType
  ) => void;
  // onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
  total_sessions: [number, number];
  onMesoProgressionUpdate: (id: string, newMesoProgression: number[]) => void;
  onFrequencyProgressionChange: (
    id: MusclePriorityType["id"],
    type: "add" | "subtract"
  ) => void;
  onFrequencyProgressionUpdate: (
    muscle: MusclePriorityType,
    operator: "add" | "subtract"
  ) => void;
};

function Item({
  muscleGroup,
  index,
  onVolumeChange,
  total_sessions,
  onMesoProgressionUpdate,
  onFrequencyProgressionChange,
  onFrequencyProgressionUpdate,
}: ItemProps) {
  const { volume, muscle } = muscleGroup;
  const { frequencyProgression, setProgressionMatrix, landmark } = volume;
  const [totalVolumePerMesocycle, setTotalVolumePerMesocycle] = useState<
    number[]
  >([]);
  const [cellWidths, setCellWidths] = useState<string[]>([...CELL_WIDTHS]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const volumeSets = getVolumeSets(
    muscle,
    frequencyProgression[frequencyProgression.length - 1],
    landmark
  );
  const bgColor = VOLUME_BG_COLORS[landmark];

  useEffect(() => {
    const { volume, muscle } = muscleGroup;
    const { frequencyProgression, setProgressionMatrix, landmark } = volume;
    let totalVolume: number[] = [];
    for (let i = 0; i < frequencyProgression.length; i++) {
      const mesoTotalVolume = getEndOfMesocycleVolume(
        muscle,
        i + 1,
        landmark,
        setProgressionMatrix
      );
      totalVolume.push(mesoTotalVolume);
    }
    setTotalVolumePerMesocycle(totalVolume);
  }, [muscleGroup]);

  const onSelectHandler = useCallback(
    (value: string) => {
      onVolumeChange(muscleGroup.id, value as VolumeLandmarkType);
    },
    [index]
  );

  const changeCellWidthsHandler = (isEditing: boolean) => {
    if (isEditing) {
      setCellWidths([...CELL_WIDTHS_ON_EDIT]);
    } else {
      setCellWidths([...CELL_WIDTHS]);
    }
  };

  const onEditHandler = (isEditing: boolean) => {
    setIsEditing(isEditing);
    changeCellWidthsHandler(isEditing);
  };

  const onSaveMesoProgression = (newMesoProgression: number[]) => {
    onMesoProgressionUpdate(muscleGroup.id, newMesoProgression);
  };

  const onFrequencyChangeClickHandler = (type: "add" | "subtract") => {
    // onFrequencyProgressionChange(muscleGroup.id, type);
    onFrequencyProgressionUpdate(muscleGroup, type);
  };

  return (
    <li className={bgColor + " mb-0.5 flex w-full text-xs text-white"}>
      <div className={" indent-1"} style={{ width: cellWidths[0] }}>
        {index + 1}
      </div>

      <div className={" indent-1"} style={{ width: cellWidths[1] }}>
        {muscle}
      </div>

      <div className={" flex justify-evenly"} style={{ width: cellWidths[2] }}>
        <Select
          volume_landmark={landmark}
          options={["MRV", "MEV", "MV"]}
          onSelect={onSelectHandler}
          bgColor={bgColor}
        />
        <div className=" ">{volumeSets}</div>
      </div>
      <div style={{ width: cellWidths[3] }} className="flex justify-evenly">
        <Button
          className={`h-4 w-4 ${BG_COLOR_M6} font-bold text-white hover:${BG_COLOR_M5}`}
          onClick={() => onFrequencyChangeClickHandler("subtract")}
        >
          -
        </Button>

        <MesocycleFrequency
          mesoProgression={frequencyProgression}
          total_sessions={total_sessions}
          isEditing={isEditing}
          onEditHandler={onEditHandler}
          width={cellWidths[3]}
          onMesoProgressionUpdate={onSaveMesoProgression}
        />

        <Button
          className={`h-4 w-4 ${BG_COLOR_M6} font-bold text-white hover:${BG_COLOR_M5}`}
          onClick={() => onFrequencyChangeClickHandler("add")}
        >
          +
        </Button>
      </div>
      <MesocycleVolumes
        mesocycleVolumes={totalVolumePerMesocycle}
        width={cellWidths[4]}
      />
    </li>
  );
}

type MusclePriorityListProps = {
  musclePriority: MusclePriorityType[];
  splitSessions: SplitSessionsType;
  mesocycles: number;
  microcycles: number;
  volumeLandmarkBreakpoints: [number, number];
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
  total_sessions: [number, number];
  onMesoProgressionUpdate: (id: string, newMesoProgression: number[]) => void;
  onPriorityChange: (items: MusclePriorityType[]) => void;
  // onFrequencyProgressionChange: (
  //   id: MusclePriorityType["id"],
  //   type: "add" | "subtract"
  // ) => void;
  onPrioritySave: (
    new_list: MusclePriorityType[],
    breakpoints: [number, number]
  ) => void;
};

export function MusclePriorityList({
  musclePriority,
  splitSessions,
  mesocycles,
  microcycles,
  volumeLandmarkBreakpoints,
  onVolumeChange,
  total_sessions,
  onMesoProgressionUpdate,
  onPriorityChange,
  onPrioritySave,
}: MusclePriorityListProps) {
  const {
    draggableList,
    volumeBreakpoints,
    setDraggableList,
    onReorder,
    onVolumeLandmarkChange,
    onFrequencyProgressionChange,
    onFrequencyProgressionUpdate,
  } = useMusclePriority(
    musclePriority,
    volumeLandmarkBreakpoints,
    splitSessions,
    mesocycles,
    microcycles
  );
  const [cellWidths, setCellWidths] = useState<string[]>([...CELL_WIDTHS]);

  const onSaveHandler = useCallback(() => {
    onPrioritySave(draggableList, volumeBreakpoints);
  }, [draggableList, volumeBreakpoints]);

  const onResetHandler = useCallback(() => {
    setDraggableList(musclePriority);
  }, []);

  return (
    <div className="">
      <div className={BG_COLOR_M6 + " mb-1 flex w-full text-xxs text-white"}>
        <div
          className={BORDER_COLOR_M8 + " border-r-2 indent-1"}
          style={{ width: cellWidths[0] }}
        >
          Rank
        </div>

        <div
          className={BORDER_COLOR_M8 + " border-r-2 indent-1"}
          style={{ width: cellWidths[1] }}
        >
          Group
        </div>

        <div
          className={BORDER_COLOR_M8 + " flex border-r-2 text-center"}
          style={{ width: cellWidths[2] }}
        >
          Volume Benchmark
        </div>

        <div
          className={BORDER_COLOR_M8 + " flex flex-col border-r-2"}
          style={{ width: cellWidths[3] }}
        >
          <div className=" mb-0.5 flex w-full justify-center">
            Mesocycle Frequency
          </div>
          <div className=" flex w-full">
            <div className=" flex w-1/3 justify-center">1</div>
            <div className=" flex w-1/3 justify-center">2</div>
            <div className=" flex w-1/3 justify-center">3</div>
          </div>
        </div>

        <div
          className={BORDER_COLOR_M8 + " flex flex-col border-r-2"}
          style={{ width: cellWidths[4] }}
        >
          <div className=" mb-0.5 flex w-full justify-center">
            Mesocycle Total Vol.
          </div>
          <div className=" flex w-full">
            <div className=" flex w-1/3 justify-center">1</div>
            <div className=" flex w-1/3 justify-center">2</div>
            <div className=" flex w-1/3 justify-center">3</div>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onReorder}>
        <StrictModeDroppable droppableId="droppable">
          {(provided, snapshot) => (
            <ul
              id="droppable"
              className=" flex w-full flex-col"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {draggableList.map((each, index) => {
                return (
                  <Draggable
                    key={`${each.id}_draggable`}
                    draggableId={each.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Item
                          key={`${each.id}_MusclePriority`}
                          muscleGroup={each}
                          index={index}
                          onVolumeChange={onVolumeLandmarkChange}
                          total_sessions={total_sessions}
                          onMesoProgressionUpdate={onMesoProgressionUpdate}
                          onFrequencyProgressionChange={
                            onFrequencyProgressionChange
                          }
                          onFrequencyProgressionUpdate={
                            onFrequencyProgressionUpdate
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <div>
        <Button onClick={onResetHandler}>Reset</Button>
        <Button onClick={onSaveHandler}>Save</Button>
      </div>
    </div>
  );
}

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  children: ReactNode;
}

function Button({ onClick, children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(`flex items-center justify-center text-xs`, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
