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
import { EditMuscleModal } from "./components/EditMuscleModal";
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

const CELL_WIDTHS = ["5%", "15%", "7%", "13%", "30%", "30%"];
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
  onFrequencyProgressionUpdate,
}: ItemProps) {
  const { volume, muscle } = muscleGroup;
  const { setProgressionMatrix, landmark, exercisesPerSessionSchema } = volume;
  const [totalVolumePerMesocycle, setTotalVolumePerMesocycle] = useState<
    number[]
  >([]);
  const [cellWidths, setCellWidths] = useState<string[]>([...CELL_WIDTHS]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [frequencyProgression, setFrequencyProgression] = useState<number[]>(
    []
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setFrequencyProgression(muscleGroup.volume.frequencyProgression);
  }, [muscleGroup]);

  const volumeSets = getVolumeSets(
    muscle,
    frequencyProgression[frequencyProgression.length - 1],
    landmark
  );
  const bgColor = VOLUME_BG_COLORS[landmark];

  useEffect(() => {
    const totalVolume: number[] = [];
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
  }, [frequencyProgression]);

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

  const onFrequencyChangeClickHandler = (type: "add" | "subtract") => {
    onFrequencyProgressionUpdate(muscleGroup, type);
  };

  const onFrequencyIndexClick = useCallback(
    (index: number) => {
      if (selectedIndex == index) {
        setSelectedIndex(null);
      } else {
        setSelectedIndex(index);
      }
    },
    [selectedIndex]
  );

  const onResetFrequency = () => {};

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <li className={bgColor + " mb-0.5 flex w-full text-xs text-white"}>
        {isModalOpen ? (
          <EditMuscleModal onClose={onCloseModal} isOpen={isModalOpen}>
            <EditMuscleModal.Card
              muscleGroup={muscleGroup}
              totalVolumePerMesocycle={totalVolumePerMesocycle}
            />
          </EditMuscleModal>
        ) : null}
        <div className={" indent-1"} style={{ width: cellWidths[0] }}>
          {index + 1}
        </div>

        <div className={" indent-1"} style={{ width: cellWidths[1] }}>
          {muscle}
        </div>

        <div className={"flex justify-center"} style={{ width: cellWidths[2] }}>
          {exercisesPerSessionSchema}
        </div>

        <div
          className={" flex justify-evenly"}
          style={{ width: cellWidths[3] }}
        >
          <Select
            volume_landmark={landmark}
            options={["MRV", "MEV", "MV"]}
            onSelect={onSelectHandler}
            bgColor={bgColor}
          />
          <div className=" ">{volumeSets}</div>
        </div>
        <div
          style={{ width: cellWidths[4] }}
          className="flex items-center justify-center"
        >
          <MesocycleFrequency
            muscle={muscleGroup}
            maxFrequency={total_sessions[0] + total_sessions[1]}
            mesoProgression={frequencyProgression}
            selectedProgressionIndex={selectedIndex}
            onFrequencyChangeClickHandler={onFrequencyProgressionUpdate}
          />
        </div>

        <MesocycleVolumes
          mesocycleVolumes={totalVolumePerMesocycle}
          width={cellWidths[5]}
        />
      </li>
      <div className="flex">
        <Button
          className="text-xxs text-white"
          onClick={() => setIsModalOpen(true)}
        >
          Edit
        </Button>
      </div>
    </>
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

  onPrioritySave: (
    new_list: MusclePriorityType[],
    breakpoints: [number, number]
  ) => void;
};

interface CellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  width: string;
}
export function Cell({ children, width, className, ...props }: CellProps) {
  return (
    <div
      {...props}
      className={cn(
        `${BG_COLOR_M6} mr-0.5 flex indent-1 text-white`,
        className
      )}
      style={{ width: width }}
    >
      {children}
    </div>
  );
}
function RowHeader({
  cellWidths,
  mesocycles,
}: {
  cellWidths: string[];
  mesocycles: number;
}) {
  const mesocycleArray = Array.from(Array(mesocycles).keys());
  return (
    <div className={" mb-1 flex w-full text-xxs text-white"}>
      <Cell width={cellWidths[0]}>Rank</Cell>
      <Cell width={cellWidths[1]}>Group</Cell>
      <Cell className="text-center leading-3" width={cellWidths[2]}>
        Exercises Per Session
      </Cell>
      <Cell width={cellWidths[3]}>Volume Landmark</Cell>
      <Cell className="flex-col items-center" width={cellWidths[4]}>
        Frequency Per Mesocycle
        <div className={`${BORDER_COLOR_M8} flex w-full border-t`}>
          {mesocycleArray.map((meso) => {
            return (
              <div
                key={`${meso + 1}_mesocycleHeaderKeys_freq`}
                className=" flex w-1/3 justify-center"
              >
                {meso + 1}
              </div>
            );
          })}
        </div>
      </Cell>
      <Cell className="flex-col items-center" width={cellWidths[5]}>
        Total Volume Per Mesocycle
        <div className={`${BORDER_COLOR_M8} flex w-full border-t`}>
          {mesocycleArray.map((meso) => {
            return (
              <div
                key={`${meso + 1}_mesocycleHeaderKeys_vol`}
                className=" flex w-1/3 justify-center"
              >
                {meso + 1}
              </div>
            );
          })}
        </div>
      </Cell>
    </div>
  );
}

MusclePriorityList.RowHeader = RowHeader;

export function MusclePriorityList({
  musclePriority,
  splitSessions,
  mesocycles,
  microcycles,
  volumeLandmarkBreakpoints,
  onVolumeChange,
  total_sessions,
  onMesoProgressionUpdate,
  onPrioritySave,
}: MusclePriorityListProps) {
  const {
    draggableList,
    volumeBreakpoints,
    setDraggableList,
    onReorder,
    onVolumeLandmarkChange,
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
      <MusclePriorityList.RowHeader
        cellWidths={cellWidths}
        mesocycles={mesocycles}
      />
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

      <div className="my-1 flex">
        <Button
          className={`${BG_COLOR_M5} mr-1  text-slate-700`}
          onClick={onResetHandler}
        >
          Reset
        </Button>
        <Button
          className={`bg-rose-400 font-bold text-white`}
          onClick={onSaveHandler}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  children: ReactNode;
}

export function Button({
  onClick,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(`flex items-center justify-center p-1 text-xs`, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
