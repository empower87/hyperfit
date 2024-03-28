import { useState } from "react";
import { BG_COLOR_M6 } from "~/constants/themes";
import {
  DayType,
  ExerciseType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import EditExerciseModal from "../../Modals/EditExerciseModal";
import { ExerciseCell, HeaderCell, MicrocycleCell, SessionCell } from "./Cells";
import {
  ROW_CELL_WIDTHS,
  ROW_SECTION_WIDTHS,
  SESSION_HEADERS,
  WEEK_ONE_HEADERS,
  WEEK_TWO_TO_FOUR_HEADERS,
} from "./constants";

type DataRowProps = {
  exercise: ExerciseType;
  split: SplitType;
  index: number;
  currentMesocycleIndex: number;
  position: "first" | "last" | "mid";
};
type HeaderRowProps = {
  sessionHeader: DayType | null;
};

function DataRow({
  exercise,
  split,
  index,
  currentMesocycleIndex,
  position,
}: DataRowProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const details = exercise.mesocycle_progression.map((each) => {
    return [each.sets, each.reps, each.weight, each.rir];
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex flex-row">
      {isOpen && (
        <EditExerciseModal
          isOpen={isOpen}
          onClose={closeModal}
          split={split}
          exercise={exercise}
          currentMesocycle={currentMesocycleIndex}
        />
      )}

      <SessionCell split={split} index={index} width={ROW_SECTION_WIDTHS[0]} />
      <ExerciseCell
        exercise={exercise}
        index={index}
        width={ROW_SECTION_WIDTHS[1]}
        cellWidths={ROW_CELL_WIDTHS["exercise"]}
        position={position}
        openModal={openModal}
      />
      <MicrocycleCell
        week="week 1"
        details={details[0]}
        width={ROW_SECTION_WIDTHS[2]}
        cellWidths={ROW_CELL_WIDTHS["week 1"]}
        position={position}
      />
      <MicrocycleCell
        week="week 2"
        details={details[1]}
        width={ROW_SECTION_WIDTHS[3]}
        cellWidths={ROW_CELL_WIDTHS["week 2"]}
        position={position}
      />
      <MicrocycleCell
        week="week 3"
        details={details[2]}
        width={ROW_SECTION_WIDTHS[4]}
        cellWidths={ROW_CELL_WIDTHS["week 3"]}
        position={position}
      />
      <MicrocycleCell
        week="week 4"
        details={details[3]}
        width={ROW_SECTION_WIDTHS[5]}
        cellWidths={ROW_CELL_WIDTHS["week 4"]}
        position={position}
      />
      <MicrocycleCell
        week="deload"
        details={details[0]}
        width={ROW_SECTION_WIDTHS[6]}
        cellWidths={ROW_CELL_WIDTHS["deload"]}
        position={position}
      />
    </div>
  );
}

const HeaderRow = ({ sessionHeader }: HeaderRowProps) => {
  return (
    <div className={" mb-1 flex flex-row"}>
      <HeaderCell
        values={sessionHeader ? [sessionHeader] : [""]}
        width={ROW_SECTION_WIDTHS[0]}
        cellWidths={ROW_CELL_WIDTHS["session"]}
      />
      <HeaderCell
        values={SESSION_HEADERS}
        width={ROW_SECTION_WIDTHS[1]}
        cellWidths={ROW_CELL_WIDTHS["exercise"]}
      />
      <HeaderCell
        values={WEEK_ONE_HEADERS}
        width={ROW_SECTION_WIDTHS[2]}
        cellWidths={ROW_CELL_WIDTHS["week 1"]}
      />
      <HeaderCell
        values={WEEK_TWO_TO_FOUR_HEADERS}
        width={ROW_SECTION_WIDTHS[3]}
        cellWidths={ROW_CELL_WIDTHS["week 2"]}
      />
      <HeaderCell
        values={WEEK_TWO_TO_FOUR_HEADERS}
        width={ROW_SECTION_WIDTHS[4]}
        cellWidths={ROW_CELL_WIDTHS["week 3"]}
      />
      <HeaderCell
        values={WEEK_TWO_TO_FOUR_HEADERS}
        width={ROW_SECTION_WIDTHS[5]}
        cellWidths={ROW_CELL_WIDTHS["week 4"]}
      />
      <HeaderCell
        values={WEEK_ONE_HEADERS}
        width={ROW_SECTION_WIDTHS[6]}
        cellWidths={ROW_CELL_WIDTHS["deload"]}
      />
    </div>
  );
};

type SessionSplitRowType = {
  day: DayType;
  sessionSplitIndex: 0 | 1;
  split: SplitType;
  exercises: ExerciseType[][];
  currentMesocycleIndex: number;
};

function SessionSplitRow({
  day,
  sessionSplitIndex,
  split,
  exercises,
  currentMesocycleIndex,
}: SessionSplitRowType) {
  let count = 0;

  const firstIndex = 0;
  const lastIndex = exercises.length - 1;

  return (
    <div className={" mb-1 flex flex-col"}>
      {sessionSplitIndex === 0 ? <HeaderRow sessionHeader={day} /> : null}

      <div className="flex flex-col">
        {exercises.map((exerciseSet, one) => {
          const lastLastIndex = exerciseSet.length - 1;
          return exerciseSet.map((exercise, two) => {
            count++;
            const position =
              lastIndex === one && lastLastIndex === two
                ? "last"
                : firstIndex === one && two === firstIndex
                ? "first"
                : "mid";
            return (
              <DataRow
                key={`${one}_exercises_training_block_${exercise.id}`}
                split={split}
                exercise={exercise}
                index={count}
                currentMesocycleIndex={currentMesocycleIndex}
                position={position}
              />
            );
          });
        })}
      </div>
    </div>
  );
}

type SessionRowProps = {
  training_day: TrainingDayType;
  currentMesocycleIndex: number;
};

function SessionRow({ training_day, currentMesocycleIndex }: SessionRowProps) {
  // const sets_one = split.sets[0];
  // const sets_two = split.sets[1];
  const sessions = training_day.sessions;
  const day = training_day.day;
  // if (!sets_one.length && !sets_two.length) return null;
  return (
    <div className={BG_COLOR_M6 + " m-1 flex flex-col shadow-xl"}>
      {/* {sets_one.length ? (
        <SessionSplitRow
          day={split.day}
          split={split.sessions[0]}
          exercises={sets_one}
          currentMesocycleIndex={currentMesocycleIndex}
          sessionSplitIndex={0}
        />
      ) : null}
      {sets_two.length ? (
        <SessionSplitRow
          day={split.day}
          split={split.sessions[1]}
          exercises={sets_two}
          currentMesocycleIndex={currentMesocycleIndex}
          sessionSplitIndex={1}
        />
      ) : null} */}
      {sessions.map((each, index) => {
        return (
          <SessionSplitRow
            key={`${each.split}_${index}_session`}
            day={day}
            split={each.split}
            exercises={each.exercises}
            currentMesocycleIndex={currentMesocycleIndex}
            sessionSplitIndex={1}
          />
        );
      })}
    </div>
  );
}

export { DataRow, HeaderRow, SessionRow };
