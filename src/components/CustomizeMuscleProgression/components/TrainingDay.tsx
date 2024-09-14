import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useMuscleEditorContext } from "../context/MuscleEditorContext";
import { ReactNode, useState } from "react";
import DotMenu from "./DotMenu";
import Dropdown from "~/components/Layout/Dropdown";
import { SessionItem } from "../MuscleEditor";
import { PlusIcon } from "~/assets/icons/_icons";

const MIN_TDAY_ITEMS = 5

type TDayUISessionType = {
  exercises: ExerciseType[]
}

type TDayUIType = {
  day: number | "ADD" | "BLANK"
  sessions: TDayUISessionType[]
}
const TRAINING_DAY_UI: TDayUIType = {
  day: 1,
  sessions: []
}

export function createTrainingDayList(
  frequencyProgression: number[],
  exercises: ExerciseType[][],
  selectedMesocycleIndex: number,
): TDayUIType[]  {
  const totalExercisesByMeso =
    frequencyProgression[selectedMesocycleIndex];
  const trainingDaysByExercises = exercises.slice(0, totalExercisesByMeso)
  const totalTrainingDays = trainingDaysByExercises.length
  const totalItemsToFill = totalTrainingDays < MIN_TDAY_ITEMS ? MIN_TDAY_ITEMS - totalTrainingDays : 0;
  const canAddTrainingDayAtMesocycle =
  !frequencyProgression[selectedMesocycleIndex + 1] ||
  (frequencyProgression[selectedMesocycleIndex + 1] &&
      frequencyProgression[selectedMesocycleIndex] <
        frequencyProgression[selectedMesocycleIndex + 1])
        ? true
        : false;

  const itemsWithContents = Array.from(Array(totalItemsToFill), (e, i) => i === 0 && canAddTrainingDayAtMesocycle ? "ADD" : "BLANK");
  
  const combinedItems = [...trainingDaysByExercises, ...itemsWithContents]

  return combinedItems.map((item, index) => {
    if (typeof item !== "string") {
      return {
        ...TRAINING_DAY_UI,
        day: index + 1,
        sessions: [{ exercises: item }]
      }
    } else if (item === "ADD") {
      return {
        ...TRAINING_DAY_UI,
        day: "ADD"
      }
    } else {
      return {
        ...TRAINING_DAY_UI, 
        day: "BLANK"
      }
    }
  })
}

export function TrainingDays({children}: {children: ReactNode}) {

  return (
    <div className={`w-auto  min-h-[95px] space-x-1 overflow-x-auto p-2 flex`}>
      {children}
    </div>
  )
}

type AddItemProps = {
  children?: ReactNode;
};
function AddDayItem({ children }: AddItemProps) {
  return (
    <div
      className={`mb-2 flex w-56 items-center justify-center rounded-md p-2 bg-primary-800 opacity-[40%]`}
    >
      {children}
    </div>
  );
}

export function TrainingDayController({ data, exercise_indices }: TrainingDayCardProps) {
  const {
    onAddTrainingDay,
  } = useMuscleEditorContext();
  switch (data.day) {
    case "ADD":
      return (
        <AddDayItem>
          <button
            onClick={onAddTrainingDay}
            className={`flex items-center justify-center p-1 hover:bg-primary-700`}
          >
            <PlusIcon fill="white" />
          </button>

      </AddDayItem>
      )
    case "BLANK":
      return <AddDayItem />
    default:
        return (
          <TrainingDay
            index={typeof data.day === "number" ? data.day : 0}
          > {
            data.sessions.map((session, index) => {
              return (
                <SessionItem
                  sessionExercises={session.exercises}
                  sessionIndex={index}
                  exerciseIndices={exercise_indices}
                />

              )
            }) 
          }
          </TrainingDay>
        )

  }
}
type TrainingDayCardProps = {
  data: TDayUIType,
  exercise_indices: number[]
}

type TrainingDayProps = {
  index: number;
  children: ReactNode;
};
function TrainingDay({ index, children }: TrainingDayProps) {
  const { onRemoveTrainingDay } = useMuscleEditorContext();
  const [isDropdownOpen, setIsDropownOpen] = useState(false);
  const onDropdownClose = () => setIsDropownOpen(false);
  const onDropdownOpen = () => setIsDropownOpen(true);

  return (
    <div className={`flex flex-col rounded-md bg-primary-600 mb-2`}>
      <div className={`relative flex justify-between p-1`}>
        <div className={`indent-1 text-xs font-bold text-white`}>
          Day {index + 1}
        </div>
        
        <DotMenu>
          <DotMenu.Button onClick={onDropdownOpen} />
          <DotMenu.Dropdown isOpen={isDropdownOpen}>
            <Dropdown onClose={onDropdownClose}>
              <Dropdown.Header title="Actions" onClose={onDropdownClose} />
              <Dropdown.Item onClick={() => onRemoveTrainingDay(index)}>
                Delete Session
              </Dropdown.Item>
            </Dropdown>
          </DotMenu.Dropdown>
        </DotMenu>
      </div>

      <ul className={`space-y-1 p-1 `}>{children}</ul>
    </div>
  );
}
// export default function TrainingDay() {
//     const {
//       frequencyProgression,
//       exercisesInView,
//       selectedMesocycleIndex,
//       onAddTrainingDay,
//     } = useMuscleEditorContext();
  
//     const canAddSessionAtMesocycle =
//       !frequencyProgression[selectedMesocycleIndex + 1] ||
//       (frequencyProgression[selectedMesocycleIndex + 1] &&
//         frequencyProgression[selectedMesocycleIndex] <
//           frequencyProgression[selectedMesocycleIndex + 1])
//         ? true
//         : false;
  
//     const totalSessions = exercisesInView.length;
//     const remaining = totalSessions < 5 ? 5 - totalSessions : 0;
//     const addButtonDivs = Array.from(Array(remaining), (e, i) => i);
  
//     const exerciseIndices = Array.from(
//       Array(exercisesInView.flat().length),
//       (e, i) => i + 1
//     );
  
//     return (
//       <div className={`flex min-h-[95px] space-x-1 overflow-x-auto`}>
//         {exercisesInView.map((sessionExercises, sessionIndex) => {
//           const indices = exerciseIndices.splice(0, sessionExercises.length);
//           return (
//             <Session
//               key={`${sessionExercises[0]?.id}_${sessionIndex}_Session`}
//               index={sessionIndex}
//             >
//               <SessionItem
//                 sessionExercises={sessionExercises}
//                 sessionIndex={sessionIndex}
//                 exerciseIndices={indices}
//               />
//             </Session>
//           );
//         })}
  
//         {addButtonDivs.map((e, i) => {
//           return (
//             <AddDayItem key={`${i}_AddButtonDivs`}>
//               {i === 0 && canAddSessionAtMesocycle ? (
//                 <button
//                   onClick={onAddTrainingDay}
//                   className={`flex items-center justify-center p-1 hover:bg-primary-700`}
//                 >
//                   <PlusIcon fill="white" />
//                 </button>
//               ) : null}
//             </AddDayItem>
//           );
//         })}
//       </div>
//     );
//   }