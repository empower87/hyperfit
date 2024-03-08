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
  VOLUME_BG_COLORS,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
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

const CELL_WIDTHS = ["5%", "15%", "7%", "13%", "26%", "26%", "8%"];

type ItemProps = {
  muscleGroup: MusclePriorityType;
  index: number;
  onVolumeChange: (
    id: MusclePriorityType["id"],
    volume_landmark: VolumeLandmarkType
  ) => void;
};
function Item({ muscleGroup, index, onVolumeChange }: ItemProps) {
  const { training_program_params, frequency } = useTrainingProgramContext();
  const { microcycles } = training_program_params;
  const { volume, muscle } = muscleGroup;
  const { setProgressionMatrix, landmark, exercisesPerSessionSchema } = volume;

  const [totalVolumePerMesocycle, setTotalVolumePerMesocycle] = useState<
    number[]
  >([]);
  const [frequencyProgression, setFrequencyProgression] = useState<number[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const volumeSets = getVolumeSets(
    muscle,
    frequencyProgression[frequencyProgression.length - 1],
    landmark
  );
  const bgColor = VOLUME_BG_COLORS[landmark];

  useEffect(() => {
    setFrequencyProgression(muscleGroup.volume.frequencyProgression);
  }, [muscleGroup]);

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

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <li className={bgColor + " mb-0.5 flex w-full text-xs text-white"}>
        {isModalOpen ? (
          <EditMuscleModal onClose={onCloseModal} isOpen={isModalOpen}>
            <EditMuscleModal.Card
              rank={index + 1}
              muscleGroup={muscleGroup}
              microcycles={microcycles}
              onClose={onCloseModal}
            />
          </EditMuscleModal>
        ) : null}
        <div className={" indent-1"} style={{ width: CELL_WIDTHS[0] }}>
          {index + 1}
        </div>

        <div className={" indent-1"} style={{ width: CELL_WIDTHS[1] }}>
          {muscle}
        </div>

        <div
          className={"flex justify-center"}
          style={{ width: CELL_WIDTHS[2] }}
        >
          {exercisesPerSessionSchema}
        </div>

        <div
          className={" flex justify-evenly"}
          style={{ width: CELL_WIDTHS[3] }}
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
          style={{ width: CELL_WIDTHS[4] }}
          className="flex items-center justify-center"
        >
          <MesocycleFrequency
            muscle={muscleGroup}
            maxFrequency={frequency[0] + frequency[1]}
            mesoProgression={frequencyProgression}
          />
        </div>

        <MesocycleVolumes
          mesocycleVolumes={totalVolumePerMesocycle}
          width={CELL_WIDTHS[5]}
        />
        <div
          className="flex items-center justify-center"
          style={{ width: CELL_WIDTHS[6] }}
        >
          <Button
            className={`text-xxs text-white ${BG_COLOR_M5} p-0.5`}
            onClick={() => setIsModalOpen(true)}
          >
            Edit
          </Button>
        </div>
      </li>
    </>
  );
}

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
function RowHeader() {
  const { training_program_params } = useTrainingProgramContext();
  const { mesocycles } = training_program_params;
  const mesocycleArray = Array.from(Array(mesocycles).keys());
  return (
    <div className={" mb-1 flex w-full text-xxs text-white"}>
      <Cell width={CELL_WIDTHS[0]}>Rank</Cell>
      <Cell width={CELL_WIDTHS[1]}>Group</Cell>
      <Cell className="text-center leading-3" width={CELL_WIDTHS[2]}>
        Exercises Per Session
      </Cell>
      <Cell width={CELL_WIDTHS[3]}>Volume Landmark</Cell>
      <Cell className="flex-col items-center" width={CELL_WIDTHS[4]}>
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
      <Cell className="flex-col items-center" width={CELL_WIDTHS[5]}>
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
      <Cell className="text-center leading-3" width={CELL_WIDTHS[6]}>
        Edit
      </Cell>
    </div>
  );
}

MusclePriorityList.RowHeader = RowHeader;

export function MusclePriorityList() {
  const {
    prioritized_muscle_list,
    split_sessions,
    training_program_params,
    mrv_breakpoint,
    mev_breakpoint,
    handleUpdateMuscleList,
    handleUpdateBreakpoints,
  } = useTrainingProgramContext();
  const { mesocycles, microcycles } = training_program_params;
  const {
    draggableList,
    volumeBreakpoints,
    setDraggableList,
    onReorder,
    onVolumeLandmarkChange,
    onFrequencyProgressionUpdate,
  } = useMusclePriority(
    prioritized_muscle_list,
    [mrv_breakpoint, mev_breakpoint],
    split_sessions,
    mesocycles,
    microcycles
  );
  const onSaveHandler = useCallback(() => {
    handleUpdateMuscleList(draggableList);
    handleUpdateBreakpoints(volumeBreakpoints);
  }, [draggableList, volumeBreakpoints]);

  const onResetHandler = useCallback(() => {
    setDraggableList(prioritized_muscle_list);
  }, []);

  return (
    <div className="">
      <MusclePriorityList.RowHeader />

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
