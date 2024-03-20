import { useState } from "react";
import { SectionH2 } from "~/components/Layout/Sections";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M6,
} from "~/constants/themes";
import {
  ExerciseType,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getRankColor";

export default function MuscleEditor() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  return (
    <SectionH2 title="MUSCLE EDITOR">
      <div className={`space-y-1`}>
        {prioritized_muscle_list.map((each, index) => {
          return <Muscle muscle={each} rank={index + 1} />;
        })}
      </div>
    </SectionH2>
  );
}

type MuscleProps = {
  muscle: MusclePriorityType;
  rank: number;
};
function Muscle({ muscle, rank }: MuscleProps) {
  const bgColor = getRankColor(muscle.volume.landmark);
  return (
    <div className={`flex ${BG_COLOR_M6} rounded`}>
      <div className={`flex w-32 flex-col`}>
        <div className={`${bgColor.bg} flex space-x-1 p-1 text-sm text-white`}>
          <div className={`w-6`}>{rank}</div>
          <div>{muscle.muscle}</div>
        </div>
      </div>
      <Exercises muscle={muscle} />
    </div>
  );
}

type ExercisesProps = {
  muscle: MusclePriorityType;
};
function Exercises({ muscle }: ExercisesProps) {
  const { training_program_params } = useTrainingProgramContext();
  const { mesocycles } = training_program_params;
  const mesocyclesArray = Array.from(Array(mesocycles), (e, i) => i);
  const [selectedMesocycleIndex, setSelectedMesocycleIndex] = useState(
    mesocycles - 1
  );

  const onTitleClick = (index: number) => {
    setSelectedMesocycleIndex(index);
  };

  return (
    <div>
      <div className={`flex space-x-1 p-1 text-sm text-white`}>
        {mesocyclesArray.map((each, index) => {
          return (
            <div
              className={cn(`cursor-pointer rounded p-0.5 text-xs`, {
                [`${BG_COLOR_M5}`]: selectedMesocycleIndex === index,
              })}
              onClick={() => onTitleClick(index)}
            >
              Mesocycle {each + 1}
            </div>
          );
        })}
      </div>
      <div className={`flex max-w-[1000px] space-x-1 overflow-x-auto`}>
        {muscle.exercises.map((each, index) => {
          return (
            <div className={`flex flex-col `}>
              <ListHeader />
              <ul className={`space-y-1 px-2 py-1 ${BG_COLOR_M7}`}>
                <SessionItem
                  exercises={each}
                  setProgressionMatrix={muscle.volume.setProgressionMatrix}
                  dayIndex={index + 1}
                  selectedMesocycleIndex={selectedMesocycleIndex}
                />
              </ul>
            </div>
          );
        })}
      </div>
      {/* <div className={`flex flex-col `}>
        <ListHeader />
        <ul className={`space-y-1 px-2 py-1 ${BG_COLOR_M7}`}>
          {muscle.exercises.map((each, index) => {
            return (
              <SessionItem
                exercises={each}
                setProgressionMatrix={muscle.volume.setProgressionMatrix}
                dayIndex={index + 1}
                selectedMesocycleIndex={selectedMesocycleIndex}
              />
            );
          })}
        </ul>
      </div> */}
      <Totals />
    </div>
  );
}
type SessionItemProps = {
  exercises: ExerciseType[];
  setProgressionMatrix: number[][][][];
  dayIndex: number;
  selectedMesocycleIndex: number;
};
function SessionItem({
  exercises,
  setProgressionMatrix,
  dayIndex,
  selectedMesocycleIndex,
}: SessionItemProps) {
  const matrix = setProgressionMatrix[selectedMesocycleIndex];
  console.log(matrix, exercises, "What We LOOKING AT HERE??");
  return (
    <div className={`flex rounded ${BG_COLOR_M6}`}>
      <div className={`w-10 p-0.5 text-xs text-white `}>Day {dayIndex}</div>
      <div className={`flex flex-col space-y-1 p-1`}>
        {exercises.map((each, index) => {
          return (
            <ExerciseItem
              exercise={each}
              index={index + 1}
              dayIndex={dayIndex}
              setProgressionMatrix={matrix}
              selectedMesocycleIndex={selectedMesocycleIndex}
            />
          );
        })}
      </div>
    </div>
  );
}

function ListHeader() {
  const { training_program_params } = useTrainingProgramContext();
  const { microcycles } = training_program_params;
  const microcyclesArray = Array.from(Array(microcycles), (e, i) => i);
  return (
    <div
      className={`flex p-0.5 text-xs text-slate-300 ${BG_COLOR_M7} border-b ${BORDER_COLOR_M6}`}
    >
      <div className={`w-10`}>Days</div>
      <div className={`flex w-40 justify-between`}>
        <div>Exercise</div>
        <div>Weeks</div>
      </div>
      <div className={`flex`}>
        {microcyclesArray.map((each) => {
          return (
            <div className={`flex w-4 items-center justify-center`}>
              {each + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ExerciseItemProps = {
  exercise: ExerciseType;
  index: number;
  dayIndex: number;
  setProgressionMatrix: number[][][];
  selectedMesocycleIndex: number;
};
function ExerciseItem({
  exercise,
  index,
  dayIndex,
  setProgressionMatrix,
  selectedMesocycleIndex,
}: ExerciseItemProps) {
  const { training_program_params } = useTrainingProgramContext();
  const { microcycles } = training_program_params;
  const microcyclesArray = Array.from(Array(microcycles), (e, i) => i);

  return (
    <li className={`flex p-0.5 text-xxs text-white ${BG_COLOR_M5}`}>
      <div className={`flex w-3 items-center justify-center`}>{index}</div>
      <div className={`flex w-36 items-center text-ellipsis indent-1`}>
        {exercise.exercise}
      </div>
      <div className={`flex`}>
        {setProgressionMatrix.map((each, i) => {
          const session = each[dayIndex - 1];
          let sets = 0;
          if (session) {
            sets = session[index - 1];
          }
          return <div className={`w-4`}>{sets}</div>;
        })}
      </div>
    </li>
  );
}

function Totals() {
  return (
    <div className={`flex text-xs text-white`}>
      <div className={``}>Frequency</div>
    </div>
  );
}
