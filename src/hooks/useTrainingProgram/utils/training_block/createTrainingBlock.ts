import {
  ExerciseType,
  MusclePriorityType,
  SplitSessionsType,
} from "../../reducer/trainingProgramReducer";

export const MUSCLES_IN_EACH_SPLIT: Record<string, string[]> = {
  upper: [
    "abs",
    "back",
    "biceps",
    "chest",
    "delts_front",
    "delts_rear",
    "delts_side",
    "forearms",
    "traps",
    "triceps",
  ],
  lower: ["abs", "calves", "glutes", "hamstrings", "quads"],
  push: ["chest", "delts_front", "delts_side", "triceps"],
  pull: ["back", "biceps", "delts_rear", "forearms"],
  legs: ["abs", "calves", "glutes", "hamstrings", "quads"],
  full: [
    "abs",
    "back",
    "biceps",
    "calves",
    "chest",
    "delts_front",
    "delts_rear",
    "delts_side",
    "forearms",
    "glutes",
    "hamstrings",
    "quads",
    "traps",
    "triceps",
  ],
  back: ["back", "traps"],
  chest: ["chest"],
  shoulders: ["delts_front", "delts_rear", "delts_side"],
  arms: ["biceps", "forearms", "triceps"],
};

type AssignedExercise = {
  session_index: number;
  split: string;
  muscle_name: string;
  exercises: ExerciseType[];
};

export function getSplitList(split_sessions: SplitSessionsType): string[] {
  const split_keys: string[] = [];
  for (const key in split_sessions.sessions) {
    const num_value =
      split_sessions.sessions[key as keyof typeof split_sessions.sessions];
    const repeat = `${key}-`.repeat(num_value ?? 1);
    const keyWithoutDash = repeat.split("-");
    split_keys.push(...keyWithoutDash);
  }
  return split_keys.filter((split) => split !== "");
}

const getValidSessionIndicesForMuscle = (
  splitList: string[],
  muscleName: string
): number[] => {
  return splitList
    .map((split, i) =>
      MUSCLES_IN_EACH_SPLIT[split]?.includes(muscleName) ? i : null
    )
    .filter((i): i is number => i !== null);
};

const determineSessionsPerMesocycle = (
  muscle_priority_list: MusclePriorityType[],
  split_list: string[],
  mesocycles: number
) => {
  const max_frequencies: Record<number, (string | null)[]> = {};

  // initiate max_frequencies with mesocycles and set each to a list of null values representing each split.
  const init_null_list = split_list.map((split) => null);
  for (let i = 0; i < mesocycles; i++) {
    max_frequencies[i] = init_null_list;
  }

  const split_counts: Record<string, number> = {};
  for (const split of split_list) {
    split_counts[split] = (split_counts[split] || 0) + 1;
  }

  const meso_counts: Record<number, string[]> = {};
  for (let meso = 0; meso < mesocycles; meso++) {
    meso_counts[meso] = [];

    for (const muscle of muscle_priority_list) {
      const muscle_name = muscle.muscle;
      const frequency = muscle.frequency.progression;
      const curr_frequency = frequency[meso];

      const valid_session_indices = getValidSessionIndicesForMuscle(
        split_list,
        muscle_name
      );

      const frequency_session_indices = valid_session_indices.slice(
        0,
        curr_frequency
      );

      for (let j = 0; j < frequency_session_indices.length; j++) {
        const split = split_list[frequency_session_indices[j]];
        const split_with_index = `${split}_${frequency_session_indices[j]}`;
        if (!meso_counts[meso].includes(split_with_index)) {
          meso_counts[meso].push(split_with_index);
        }
      }
    }

    max_frequencies[meso] = max_frequencies[meso].map((e, i) =>
      meso_counts[meso][i] ? meso_counts[meso][i] : null
    );
  }

  console.log(
    split_counts,
    max_frequencies,
    meso_counts,
    "FUNCTION: determineSessionsPerMesocycle => stateNormalization.ts"
  );
  return max_frequencies;
};

export const createTrainingBlock = (
  muscle_priority_list: MusclePriorityType[],
  split_list: string[],
  mesocycles: number
) => {
  const final_tblock: Record<number, Record<number, AssignedExercise[]>> = {};

  // 1. Modify the split_list to only include the necessary sessions per mesocycle.
  const sessions_per_meso = determineSessionsPerMesocycle(
    muscle_priority_list,
    split_list,
    mesocycles
  );

  // 2. Fill the final_tblock with split sessions per mesocycle outlined by sessions_per_meso.
  for (let j = 0; j < mesocycles; j++) {
    for (let i = 0; i < split_list.length; i++) {
      const valid_splits = sessions_per_meso[j];
      const selected_split = valid_splits[i];
      if (selected_split) {
        const split_index = selected_split.split("_")[1];
        final_tblock[j] = { ...final_tblock[j], [split_index]: [] };
      }
    }
  }

  // 3. Loop over list to fill out sessions over mesocycles with priority muscles filled out first.
  for (const muscle of muscle_priority_list) {
    const muscle_name = muscle.muscle;
    const frequency_progression = muscle.frequency.progression;
    const frequency_target = muscle.frequency.target;
    const exercises = muscle.exercises;

    for (let meso = frequency_progression.length - 1; meso >= 0; meso--) {
      const freq = frequency_progression[meso] ?? frequency_target;
      const session_indices = getValidSessionIndicesForMuscle(
        split_list,
        muscle_name
      );

      const filtered_indices = session_indices.filter((idx) => {
        const meso_sessions = sessions_per_meso[meso];
        const max_frequencies_indices = meso_sessions.map((each) => {
          if (each) {
            return Number(each.split("_")[1]);
          } else return null;
        });
        const split_index = max_frequencies_indices.includes(idx);
        if (split_index !== null) return true;
      });

      // Sort by current load (least loaded first)
      const session_exercise_counts = filtered_indices.map((idx) => ({
        idx: idx,
        count: final_tblock[meso][idx]?.reduce(
          (acc, cur) => cur.exercises.length + acc,
          0
        ),
      }));

      session_exercise_counts.sort((a, b) => a.count - b.count);

      const sorted_session_indices = session_exercise_counts.map(
        (obj) => obj.idx
      );

      // Pick the first `freq` sessions with the least exercises
      const chosen_sessions = sorted_session_indices.slice(0, freq);

      if (chosen_sessions.length === 0) continue;
      for (let j = 0; j < freq; j++) {
        const session_idx = chosen_sessions[j];
        const valid_exercises = exercises[j] ?? [];

        if (!final_tblock[meso][session_idx]) {
          final_tblock[meso][session_idx] = [];
        }
        final_tblock[meso][session_idx].push({
          session_index: session_idx,
          split: split_list[session_idx],
          exercises: valid_exercises,
          muscle_name: muscle_name,
        });
      }
    }
  }

  console.log(
    readableTBlockForTesting(final_tblock, split_list),
    sessions_per_meso,
    final_tblock,
    "FUNCTION: createTrainingBlock => createTrainingBlock.ts"
  );
  return final_tblock;
};

// NOTE: This function is only for development testing outcomes via console.log
const readableTBlockForTesting = (
  finalPlan: Record<number, Record<number, AssignedExercise[]>>,
  splitList: string[]
) => {
  const output: Record<string, Record<string, [string, string][]>> = {};

  for (const [mesoIdx, sessions] of Object.entries(finalPlan)) {
    const mesoKey = `mesocycle_${mesoIdx}`;
    output[mesoKey] = {};

    for (const [sessionIdx, assignments] of Object.entries(sessions)) {
      const splitName = splitList[Number(sessionIdx)];
      const sessionKey = `${splitName}_${sessionIdx}`;

      output[mesoKey][sessionKey] = assignments
        .map((a) => {
          const exercises: [string, string][] = a.exercises.map((ex) => [
            a.muscle_name,
            ex.name,
          ]);
          return [...exercises];
        })
        .flat();
    }
  }

  return output;
};
