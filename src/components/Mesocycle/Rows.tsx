import {
  DayType,
  ExerciseType,
  SessionDayType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { ExerciseCell, HeaderCell, MicrocycleCell, SessionCell } from "./Cells";
import {
  ROW_CELL_WIDTHS,
  ROW_SECTION_WIDTHS,
  SESSION_HEADERS,
  WEEK_ONE_HEADERS,
  WEEK_TWO_TO_FOUR_HEADERS,
} from "./constants";

type RowProps = {
  exercise: ExerciseType;
  index: number;
  currentMesocycleIndex: number;
};

function DataRow({ exercise, index, currentMesocycleIndex }: RowProps) {
  const details = exercise.meso_details[currentMesocycleIndex];
  if (!details) return null;

  return (
    <div className="flex flex-row border-b border-slate-500">
      <ExerciseCell
        exercise={exercise}
        index={index}
        width={ROW_SECTION_WIDTHS[1]}
        cellWidths={ROW_CELL_WIDTHS["exercise"]}
      />
      <MicrocycleCell
        week="week 1"
        details={details}
        width={ROW_SECTION_WIDTHS[2]}
        cellWidths={ROW_CELL_WIDTHS["week 1"]}
      />
      <MicrocycleCell
        week="week 2"
        details={details}
        width={ROW_SECTION_WIDTHS[3]}
        cellWidths={ROW_CELL_WIDTHS["week 2"]}
      />
      <MicrocycleCell
        week="week 3"
        details={details}
        width={ROW_SECTION_WIDTHS[4]}
        cellWidths={ROW_CELL_WIDTHS["week 3"]}
      />
      <MicrocycleCell
        week="week 4"
        details={details}
        width={ROW_SECTION_WIDTHS[5]}
        cellWidths={ROW_CELL_WIDTHS["week 4"]}
      />
      <MicrocycleCell
        week="deload"
        details={details}
        width={ROW_SECTION_WIDTHS[6]}
        cellWidths={ROW_CELL_WIDTHS["deload"]}
      />
    </div>
  );
}

const HeaderRow = () => {
  return (
    <div className="flex flex-row">
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

type SessionRowType = {
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
}: SessionRowType) {
  let count = 0;
  return (
    <div className="flex flex-row">
      <SessionCell
        day={day}
        sessionSplitIndex={sessionSplitIndex}
        split={split}
      />

      <div className="flex flex-col border border-slate-300">
        <HeaderRow />
        <div className="flex flex-col border-2 border-slate-500">
          {exercises.map((exerciseSet) => {
            return exerciseSet.map((exercise) => {
              count++;
              return (
                <DataRow
                  exercise={exercise}
                  index={count}
                  currentMesocycleIndex={currentMesocycleIndex}
                />
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}

type SessionRowProps = { split: SessionDayType; currentMesocycleIndex: number };

function SessionRow({ split, currentMesocycleIndex }: SessionRowProps) {
  const sets_one = split.sets[0];
  const sets_two = split.sets[1];

  return (
    <div className="mb-1 flex flex-col">
      {sets_one.length ? (
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
      ) : null}
    </div>
  );
}

export { DataRow, HeaderRow, SessionRow };
