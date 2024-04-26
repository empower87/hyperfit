import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { BG_COLOR_M6, BG_COLOR_M7 } from "~/constants/themes";
import { MuscleType } from "~/constants/workoutSplits";
import {
  DayType,
  ExerciseMesocycleProgressionType,
  ExerciseTrainingModality,
  SetProgressionType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import Mesocycle from "../Mesocycle";

type MicrocyclesType = {
  week: number;
  sets: number;
  reps: number;
  weight: number;
  rir: number;
};

type DataType = {
  exercise: {
    num: number;
    group: string;
    name: string;
    equipment: string;
    modality: string;
  };
  microcycles: MicrocyclesType[];
  deload: MicrocyclesType[];
};
const DATA: DataType = {
  exercise: {
    num: 0,
    group: "back",
    name: "pulldown",
    equipment: "machine",
    modality: "straight",
  },
  microcycles: [],
  deload: [],
};

const buildExerciseDataRow = (exercise: ExerciseType, index: number) => {
  let data = { ...DATA };
  const details = exercise.mesocycle_progression.map((each, index) => {
    return {
      week: index,
      sets: each.sets,
      reps: each.reps,
      weight: each.weight,
      rir: each.rir,
    };
  });

  data = {
    ...data,
    exercise: {
      ...data.exercise,
      num: index,
      group: exercise.muscle,
      name: exercise.exercise,
      equipment: "dumbbell",
      modality: exercise.trainingModality,
    },
    microcycles: details,
    deload: [
      {
        ...details[details.length - 1],
        week: details[details.length - 1].week + 1,
      },
    ],
  };
  return data;
};

type SessionDataType = {
  split: string;
  exercises: DataType[];
};
const SESSION_DATA: SessionDataType = {
  split: "upper",
  exercises: [],
};
type DayDataType = {
  day: string;
  sessions: SessionDataType[];
};
const DAY_DATA: DayDataType = {
  day: "Monday",
  sessions: [],
};
export default function TrainingBlock() {
  const { training_block, training_program_params } =
    useTrainingProgramContext();
  const { mesocycles, microcycles } = training_program_params;

  return (
    <div id="training_block" className={" flex flex-col"}>
      {training_block.map((each, index) => {
        return (
          <Mesocycle
            key={`${index}_${each[index]?.day}_mesocycles`}
            split={each}
            currentMesocycleIndex={index}
          />
        );
      })}
    </div>
  );
}
export type ExerciseType = {
  id: string;
  exercise: string;
  muscle: MuscleType;
  session: number;
  rank: VolumeLandmarkType;
  sets: number;
  reps: number;
  weight: number;
  rir: number;
  weightIncrement: number;
  trainingModality: ExerciseTrainingModality;
  mesocycle_progression: ExerciseMesocycleProgressionType[];
  supersetWith: ExerciseType["id"] | null;
  initialSetsPerMeso: number[];
  setProgressionSchema: SetProgressionType[];
};

export type SessionSplitType = SplitType | "off";
export type SessionType = {
  id: string;
  split: SessionSplitType;
  exercises: ExerciseType[];
};

export type TrainingDayTypee = {
  day: DayType;
  isTrainingDay: boolean;
  sessions: SessionType[];
};

type DType = {
  split: string;
  exercises: ExerciseType[];
};
// export default function TrainingBlock() {
//   const { training_block, training_program_params } =
//     useTrainingProgramContext();
//   const { mesocycles, microcycles } = training_program_params;

//   return (
//     <div id="training_block" className={" flex flex-col"}>
//       {/* {training_block.map((each, index) => {
//         return (
//           <Mesocycle
//             key={`${index}_${each[index]?.day}_mesocycles`}
//             split={each}
//             currentMesocycleIndex={index}
//           />
//         );
//       })} */}
//       {training_block.map((each, index) => {
//         return (
//           <TrainingBlockTable
//             mesocycle={each}
//             index={index}
//             microcycles={microcycles}
//           />
//         );
//       })}
//     </div>
//   );
// }
const columnHelper = createColumnHelper<TrainingDayTypee>();

// const DELOAD = [
//   columnHelper.group({
//     header: `Deload`,
//     columns: [
//       columnHelper.accessor("microcycles.sets", {
//         header: "sets",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("microcycles.reps", {
//         header: "reps",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("microcycles.weight", {
//         header: "weight",
//         cell: (info) => info.getValue(),
//       }),
//       columnHelper.accessor("microcycles.rir", {
//         header: "rir",
//         cell: (info) => info.getValue(),
//       }),
//     ],
//   }),
// ];

const getExercisesColumns = (sessionIndex: number, exerciseIndex: number) => {
  return columnHelper.group({
    header: "Exercise",
    columns: [
      columnHelper.accessor(
        (row) => row.sessions[sessionIndex].exercises[exerciseIndex],
        {
          header: "#",
          cell: (info) => info.getValue(),
        }
      ),
      columnHelper.accessor(
        (row) => row.sessions[sessionIndex].exercises[exerciseIndex].muscle,
        {
          header: "Group",
          cell: (info) => info.getValue(),
        }
      ),
      columnHelper.accessor(
        (row) => row.sessions[sessionIndex].exercises[exerciseIndex].exercise,
        {
          header: "Name",
          cell: (info) => info.getValue(),
        }
      ),
      columnHelper.accessor(
        (row) => row.sessions[sessionIndex].exercises[exerciseIndex].muscle,
        {
          header: "Equipment",
          cell: (info) => info.getValue(),
        }
      ),
      columnHelper.accessor(
        (row) =>
          row.sessions[sessionIndex].exercises[exerciseIndex].trainingModality,
        {
          header: "Modality",
          cell: (info) => info.getValue(),
        }
      ),
    ],
  });
};

const getMicrocyclesColumns = (
  microcycles: number,
  sessionIndex: number,
  exerciseIndex: number
) => {
  return Array.from(Array(microcycles), (e, i) =>
    columnHelper.group({
      header: `Week ${i + 1}`,
      columns: [
        columnHelper.accessor(
          (row) => row.sessions[sessionIndex].exercises[exerciseIndex].sets,
          {
            header: "sets",
            cell: (info) => info.getValue(),
          }
        ),
        columnHelper.accessor(
          (row) => row.sessions[sessionIndex].exercises[exerciseIndex].reps,
          {
            header: "reps",
            cell: (info) => info.getValue(),
          }
        ),
        columnHelper.accessor(
          (row) => row.sessions[sessionIndex].exercises[exerciseIndex].weight,
          {
            header: "weight",
            cell: (info) => info.getValue(),
          }
        ),
        columnHelper.accessor(
          (row) => row.sessions[sessionIndex].exercises[exerciseIndex].rir,
          {
            header: "rir",
            cell: (info) => info.getValue(),
          }
        ),
      ],
    })
  );
};

type TrainingBlockTableProps = {
  mesocycle: TrainingDayType[];
  index: number;
  microcycles: number;
};
function TrainingBlockTable({
  mesocycle,
  index,
  microcycles,
}: TrainingBlockTableProps) {
  const filteredMesocycle = mesocycle.filter((each) => each.sessions.length);
  const data: TrainingDayTypee[] = useMemo(
    () =>
      filteredMesocycle.map((each) => ({
        ...each,
        sessions: each.sessions.map((ea) => ({
          ...ea,
          exercises: ea.exercises.flat(),
        })),
      })),
    [filteredMesocycle]
  );

  const columns: ColumnDef<TrainingDayTypee>[] = useMemo(() => {
    const cols = filteredMesocycle.map((each) => {
      const sessions = each.sessions
        .map((session, sessionIndex) => {
          const flattenedExercises = session.exercises.flat();
          const exercises = flattenedExercises
            .map((exercise, exerciseIndex) => {
              const exerciseColumns = getExercisesColumns(
                sessionIndex,
                exerciseIndex
              );
              const microcyclesColumns = getMicrocyclesColumns(
                microcycles,
                sessionIndex,
                exerciseIndex
              );
              return [exerciseColumns, ...microcyclesColumns];
            })
            .flat();
          return exercises;
        })
        .flat();

      return [
        columnHelper.display({
          header: "Day",
          cell: (info) => info.getValue(),
        }),
        [...sessions],
      ].flat();
    });
    return cols.flat();
  }, [filteredMesocycle]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className={`border-collapse`}>
      <thead>
        {table.getHeaderGroups().map((headerGroup, i) => (
          <tr key={`${headerGroup.id}_${index}_${i}`}>
            {headerGroup.headers.map((header, ii) => (
              <th
                key={`${header.id}_${index}_${ii}`}
                className={`text-xs text-white ${BG_COLOR_M7}`}
                colSpan={header.colSpan}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row, i) => (
          <tr key={`${row.id}_${index}_${i}`} className={`${BG_COLOR_M6}`}>
            {row.getVisibleCells().map((cell, ii) => (
              <td
                key={`${cell.id}_${index}_${ii}`}
                className={`text-xxs text-white `}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
