// TrainingPrograms
// TrainingBlocks
// Mesocycles
// Microcycles
// Sessions
// Exercises

import {
  ExerciseType,
  MusclePriorityType,
  SplitSessionsType,
} from "../reducer/trainingProgramReducer";

//
type UserA = {
  id: string;
  name: string;
  email: string;
};

type MuscleGroupName =
  | "chest"
  | "back"
  | "quads"
  | "hamstrings"
  | "delts_front"
  | "delts_rear"
  | "delts_side"
  | "biceps"
  | "triceps"
  | "forearms"
  | "abs"
  | "glutes"
  | "calves"
  | "traps";

type SetVolumeLandmark = "MV" | "MEV" | "MAV" | "MAV-P" | "MRV" | "MRV-P";

type Muscle = {
  name: MuscleGroupName;
  set_volume_landmark: SetVolumeLandmark;
  frequency_range: [number, number]; // e.g. [2, 4] for 2-4 times per week
  frequency_target: number; // e.g. 3 for 3 times per week
  frequency_mesocycle_progression: number[]; // e.g. Mesocycle 1 = 2x frequency, Mesocycle 2 = 3x frequency, Mesocycle 3 = 4x frequency
  set_mesocycle_progression: number[][][];
};

type TrainingSplit =
  | "Push/Pull/Legs"
  | "Upper/Lower"
  | "Push/Pull/Legs Upper/Lower"
  | "Bro"
  | "Full Body"
  | "Custom";

type TrainingProgram = {
  id: string;
  user_id: string;
  name: string;
  training_block_ids: string[];
  created_at: Date;
  updated_at: Date;
};

type TrainingBlock = {
  id: string;
  program_id: string;
  name: string;
  training_split: TrainingSplit;
  muscle_priority_list: Muscle[];
  sessions_per_week: number;
  mesocycles: string[]; // or denormalize if ordering is key
  start_date?: Date;
  end_date?: Date;
};

type Mesocycle = {
  id: string;
  block_id: string;
  name: string;
  week_count: number;
  order: number;
  microcycles: string[];
};

type Microcycle = {
  id: string;
  mesocycle_id: string;
  week_number: number;
  session_ids: string[];
};

type Session = {
  id: string;
  microcycle_id: string;
  day_of_week: number; // 0 = Sunday, etc.
  name?: string;
};

type SessionItem = {
  id: string;
  session_id: string;
  exercise_id: string;
  progression_method: ProgressionMethodType; // e.g. "single", "dynamic_single", "double", etc.
  order: number;
  initial_sets?: number;
  initial_reps?: number;
  initial_lbs?: number;
  initial_rir?: number;
  superset_id?: string; // for supersets, if applicable
};

type Exercise = {
  id: string;
  name: string;
  is_unilateral: boolean;
  is_compound: boolean;
  muscle_groups: string[]; // e.g. ['chest', 'triceps']
};

type ProgressionScheme = {
  id: string;
  name: string;
  description: string;
  type: "linear" | "double_progression" | "wave" | "rpe" | "custom";
  config: any; // depends on type
};

type ExerciseLog = {
  id: string;
  user_id: string;
  session_item_id: string;
  date: Date;
  set_logs: {
    reps: number;
    weight: number;
    rir?: number;
  }[];
};

type ClientState = {
  trainingPrograms: Record<string, TrainingProgram>;
  trainingBlocks: Record<string, TrainingBlock>;
  mesocycles: Record<string, Mesocycle>;
  microcycles: Record<string, Microcycle>;
  sessions: Record<string, Session>;
  sessionItems: Record<string, SessionItem>;
  exercises: Record<string, Exercise>;
  progressionSchemes: Record<string, ProgressionScheme>;
  currentProgramId?: string;
  ui: {
    selectedWeek: number;
    selectedSessionId?: string;
  };
};

const CLIENT_STATE = {
  trainingPrograms: {
    "tp-1": {
      user_id: "user-1",
    },
  },
  trainingBlocks: {
    "tb-1": {
      id: "tb-1",
      program_id: "tp-1",
      name: "",
      training_split: "PPL",
      mesocycles: ["meso-1", "meso-2", "meso-3"],
    },
  },
  mesocycles: {
    "meso-1": {
      id: "meso-1",
      block_id: "tb-1",
      name: "",
      week_count: 4,
      order: 1,
      microcycles: ["micro-1", "micro-2", "micro-3", "micro-4"],
    },
  },
  microcycles: {},
  sessions: {},
  sessionItems: {},
  exercises: {},
  progressionSchemes: {},
  currentProgramId: {},
  ui: {
    selectedWeek: 0,
  },
};

const SESSION_ITEM = {
  "session-item-1": {
    id: "session-item-1",
    exercise_id: "exercise-1",
    session_id: "session-1",
    progression_method: "single",
    order: 1,
    initial_sets: 3,
    initial_reps: 12,
    initial_lbs: 105,
    initial_rir: 2,
  },
};

type ProgressionMethodType =
  | "single"
  | "dynamic_single"
  | "double"
  | "dynamic_double"
  | "double_sets-weight"
  | "triple"
  | "wave"
  | "custom";

// SESSIONS WIP - 6/25/25
// upper = 2, lower = 1, full = 2
// 1. Back -       2,3,4
// 2. Side Delts - 2,3,4
// 3. Triceps -    1,2,3
// 4. Hamstrings - 1,2,3
// 5. Quads -      1,2,3
// 6. Rear Delts - 1,2,2
// 7. Foreams -    1,1,1
// 8. Traps -      1,2,2
// 9. Biceps -     1,2,2
// 10. Chest -     1,2,2
// 11. Calves -    1,2,2
// 12. Fnt Delts - 0,0,0
// 13. Abs -       0,0,0
// 14. Glutes -    0,0,0

// upper 1  = back_1
//            back_1
//            sdelts_1
//            sdelts_1
//            triceps_1

// upper 2 =  back_2
//            back_2
//            sdelts_2
//            sdelts_2
//            triceps_2

// lower 1 =  hamstrings_1
//            hamstrings_1
//            quads_1
//            quads_1

// full 1  =  back_3
//            back_3
//            sdelts_3
//            sdelts_3
//            triceps_3

// full 2  =  back_4
//            sdelts_4
//            hamstrings_2
//            quads_2

export const allowable_muscles_per_split = {
  upper: [
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
  lower: ["quads", "hamstrings", "glutes", "calves"],
  push: ["chest", "delts_front", "delts_side", "triceps"],
  pull: ["back", "delts_rear", "biceps", "forearms"],
  legs: ["quads", "hamstrings", "glutes", "calves"],
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
  shoulders: ["delts_front", "delts_rear", "delts_side", "traps"],
  arms: ["biceps", "triceps", "forearms"],
};

// const muscle_priority_example_1 = [
//   {
//     name: "back",
//     set_volume_landmark: "MRV",
//     frequency_range: [2, 4],
//     frequency_target: 4,
//     frequency_mesocycle_progression: [2, 3, 4],
//     exercises: [
//       [{
//         id: "exercise_1",
//         name: "Pull Up",
//         is_unilateral: false,
//         is_compound: true,
//         muscle_groups: ["back"],
//       },
//       {
//         id: "exercise_2",
//         name: "Bent Over Row",
//         is_unilateral: false,
//         is_compound: true,
//         muscle_groups: ["back"],
//       }], // exercises for session 1
//       [EXERCISE_3, EXERCISE_4], // exercises for session 2
//       [EXERCISE_5, EXERCISE_6], // exercises for session 3
//       [EXERCISE_7] // exercises for session 4
//     ]
//   },
//   { ...BICEPS },
//   { ...TRICEPS },
//   { ...QUADS },
//   ...etc
// ]

interface MusclePriority {
  name: string;
  set_volume_landmark: string;
  frequency_range: [number, number];
  frequency_target: number;
  frequency_mesocycle_progression: number[];
  exercises: Exercise[][]; // ordered by importance, grouped per intended session
}

interface AssignedExercise {
  session_index: number;
  split: string;
  muscle_name: string;
  exercises: ExerciseType[];
}

export function returnSessionSplits(
  split_sessions: SplitSessionsType
): string[] {
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

// // Helpers
// function getValidSessionIndicesForMuscle(
//   splitList: string[],
//   allowable: Record<string, string[]>,
//   muscleName: string
// ): number[] {
//   return splitList
//     .map((split, i) => (allowable[split]?.includes(muscleName) ? i : null))
//     .filter((i): i is number => i !== null);
// }

// function chooseOptimalSessions(
//   valid: number[],
//   target: number,
//   prefer: Set<number>
// ): number[] {
//   const preferred = valid.filter((i) => prefer.has(i));
//   const remaining = valid.filter((i) => !prefer.has(i));

//   const chosen = [
//     ...preferred.slice(0, target),
//     ...remaining.slice(0, target - preferred.length),
//   ];
//   return chosen.sort((a, b) => a - b);
// }

// function rebalanceExercisesInMesocycle(
//   mesoSessions: Record<number, AssignedExercise[]>,
//   splitList: string[],
//   allowable: Record<string, string[]>
// ) {
//   const newMeso: Record<number, AssignedExercise[]> = {};
//   Object.keys(mesoSessions).forEach((key) => (newMeso[Number(key)] = []));

//   // Group by muscle
//   const groupedByMuscle: Record<string, AssignedExercise[]> = {};
//   for (const sessionIndex in mesoSessions) {
//     for (const entry of mesoSessions[Number(sessionIndex)]) {
//       if (!groupedByMuscle[entry.muscle]) groupedByMuscle[entry.muscle] = [];
//       groupedByMuscle[entry.muscle].push(entry);
//     }
//   }

//   // For each muscle, group compatible sessions by split and round-robin distribute
//   for (const [muscle, assignments] of Object.entries(groupedByMuscle)) {
//     // Get all compatible session indices for this muscle
//     const validSessions = getValidSessionIndicesForMuscle(
//       splitList,
//       allowable,
//       muscle
//     );

//     // Group those session indices by split name
//     const splitGroups: Record<string, number[]> = {};
//     for (const i of validSessions) {
//       const split = splitList[i];
//       if (!splitGroups[split]) splitGroups[split] = [];
//       splitGroups[split].push(i);
//     }

//     // Assign exercises back round-robin across valid sessions within same split
//     const sessionsUsed = Object.values(splitGroups).flat();
//     const sessionCount = sessionsUsed.length;

//     assignments.forEach((exercise, idx) => {
//       const targetSession = sessionsUsed[idx % sessionCount];
//       newMeso[targetSession].push({ ...exercise, sessionIndex: targetSession });
//     });
//   }

//   return newMeso;
// }

// // Core function
// export function assignExercises(
//   musclePriorityList: MusclePriorityType[],
//   splitList: string[],
//   allowableMuscles: Record<string, string[]>,
//   totalMesocycles: number
// ) {

//   const finalPlan: Record<number, Record<number, AssignedExercise[]>> = {}; // meso -> session -> exercises

//   for (const muscle of musclePriorityList) {
//     const sessionIndices = getValidSessionIndicesForMuscle(
//       splitList,
//       allowableMuscles,
//       muscle.muscle
//     );
//     let assignedSessions = new Set<number>();

//     for (let meso = 0; meso < totalMesocycles; meso++) {
//       const freq =
//         muscle.frequency.progression[meso] ?? muscle.frequency.target;
//       const chosenSessions = chooseOptimalSessions(
//         sessionIndices,
//         freq,
//         assignedSessions
//       );
//       console.log(
//         meso,
//         muscle.muscle,
//         muscle.exercises,
//         sessionIndices,
//         freq,
//         assignedSessions,
//         chosenSessions,
//         finalPlan,
//         "FUNCTION: assignExercises => stateNormalization.ts .. WHAT WE WORKING WITH HERE?"
//       );
//       assignedSessions = new Set([...assignedSessions, ...chosenSessions]);

//       if (!finalPlan[meso]) finalPlan[meso] = {};

//       for (let i = 0; i < freq; i++) {
//         const sessionIdx = chosenSessions[i];
//         const exerciseGroup = muscle.exercises[i] ?? [];

//         if (!finalPlan[meso][sessionIdx]) finalPlan[meso][sessionIdx] = [];
//         finalPlan[meso][sessionIdx].push({
//           sessionIndex: sessionIdx,
//           split: splitList[sessionIdx],
//           exerciseGroup,
//           muscle: muscle.muscle,
//         });
//       }
//     }
//   }

//   // Rebalance each mesocycle to even out session lengths
//   for (const meso of Object.keys(finalPlan)) {
//     const mesoIndex = Number(meso);
//     finalPlan[mesoIndex] = rebalanceExercisesInMesocycle(
//       finalPlan[mesoIndex],
//       splitList,
//       allowableMuscles
//     );
//   }

//   return finalPlan; // [mesocycle][session] => AssignedExercise[]
// }
// Helpers
function getValidSessionIndicesForMuscle(
  splitList: string[],
  allowable: Record<string, string[]>,
  muscleName: string
): number[] {
  return splitList
    .map((split, i) => (allowable[split]?.includes(muscleName) ? i : null))
    .filter((i): i is number => i !== null);
}

function chooseOptimalSessions(
  valid: number[],
  target: number,
  prefer: Set<number>
): number[] {
  const preferred = valid.filter((i) => prefer.has(i));
  const remaining = valid.filter((i) => !prefer.has(i));

  const chosen = [
    ...preferred.slice(0, target),
    ...remaining.slice(0, target - preferred.length),
  ];
  return chosen.sort((a, b) => a - b); // consistent order
}

function rebalanceExercisesInMesocycle(
  mesoSessions: Record<number, AssignedExercise[]>,
  splitList: string[],
  allowable: Record<string, string[]>
) {
  const newMeso: Record<number, AssignedExercise[]> = {};
  Object.keys(mesoSessions).forEach((key) => (newMeso[Number(key)] = []));

  // Group exercises by muscle
  const groupedByMuscle: Record<string, AssignedExercise[]> = {};
  for (const sessionIndex in mesoSessions) {
    for (const entry of mesoSessions[Number(sessionIndex)]) {
      if (!groupedByMuscle[entry.muscle_name])
        groupedByMuscle[entry.muscle_name] = [];
      groupedByMuscle[entry.muscle_name].push(entry);
    }
  }

  for (const [muscle, assignments] of Object.entries(groupedByMuscle)) {
    const validSessions = getValidSessionIndicesForMuscle(
      splitList,
      allowable,
      muscle
    );

    // Group valid session indices by split
    const splitSessionMap: Record<string, number[]> = {};
    for (const i of validSessions) {
      const split = splitList[i];
      if (!splitSessionMap[split]) splitSessionMap[split] = [];
      splitSessionMap[split].push(i);
    }

    // Group the current muscle's assignments by split type
    const muscleSplitAssignments: Record<string, AssignedExercise[]> = {};
    for (const assignment of assignments) {
      const split = splitList[assignment.session_index];
      if (!muscleSplitAssignments[split]) muscleSplitAssignments[split] = [];
      muscleSplitAssignments[split].push(assignment);
    }

    // For each split group, rebalance within its valid sessions based on current exercise count
    for (const [split, splitAssignments] of Object.entries(
      muscleSplitAssignments
    )) {
      const availableSessions = splitSessionMap[split] ?? [];
      console.log(
        muscle,
        groupedByMuscle,
        muscleSplitAssignments,
        splitSessionMap,
        availableSessions,
        "muscleSplitAssignments"
      );
      if (availableSessions.length === 0) continue;

      for (const assignment of splitAssignments) {
        // Find the session with the least exercises currently assigned
        let leastLoadedSession = availableSessions[0];
        let minCount = newMeso[leastLoadedSession].length || 0;

        for (const sessionIdx of availableSessions) {
          const currentCount = newMeso[sessionIdx]?.length || 0;

          if (currentCount < minCount) {
            minCount = currentCount;
            leastLoadedSession = sessionIdx;
          }
        }

        newMeso[leastLoadedSession]?.push({
          ...assignment,
          session_index: leastLoadedSession,
        });
      }
    }
  }

  return newMeso;
}

const lolAI = (
  priorityMuscle: MusclePriorityType,
  splitList: string[],
  allowableMuscles: Record<string, string[]>,
  mesoIdx: number
) => {
  const splitToBestMuscle: Record<string, { muscle: string; freq: number }> =
    {};

  for (const split of splitList) {
    if (allowableMuscles[split]?.includes(priorityMuscle.muscle)) {
      const freq =
        priorityMuscle.frequency.progression[mesoIdx] ??
        priorityMuscle.frequency.target;
      if (freq > 0) {
        splitToBestMuscle[split] = { muscle: priorityMuscle.muscle, freq };
        break; // Only take the highest-ranked muscle for this split
      }
    }
  }
};

function getSessionSplitsForMesocycle(
  musclePriorityList: MusclePriorityType[],
  splitList: string[],
  allowableMuscles: Record<string, string[]>,
  mesoIdx: number
): string[] {
  // 1. For each split, find the highest-ranked muscle that can be assigned to it
  const splitToBestMuscle: Record<string, { muscle: string; freq: number }> =
    {};

  for (const split of splitList) {
    for (const muscle of musclePriorityList) {
      if (allowableMuscles[split]?.includes(muscle.muscle)) {
        const freq =
          muscle.frequency.progression[mesoIdx] ?? muscle.frequency.target;
        if (freq > 0) {
          splitToBestMuscle[split] = { muscle: muscle.muscle, freq };
          break; // Only take the highest-ranked muscle for this split
        }
      }
    }
  }

  // 2. Build a session list, preferring more specific splits before "full"
  // We'll fill each split as many times as the best muscle for that split requires
  // but only add "full" if needed to reach the total frequency required by all muscles
  const sessionSplits: string[] = [];
  const splitsNoFull = splitList.filter((s) => s !== "full");
  const splitsToUse = [
    ...splitsNoFull,
    ...(splitList.includes("full") ? ["full"] : []),
  ];

  for (const split of splitsToUse) {
    const best = splitToBestMuscle[split];
    if (best && best.freq > 0) {
      for (let i = 0; i < best.freq; i++) {
        sessionSplits.push(split);
      }
    }
  }

  // If we have fewer sessions than the highest frequency for any muscle, fill with "full"
  // (This is rare, but possible if e.g. a muscle needs more sessions than there are splits)
  const maxFreq = Math.max(
    ...musclePriorityList.map(
      (m) => m.frequency.progression[mesoIdx] ?? m.frequency.target
    )
  );
  while (sessionSplits.length < maxFreq && splitList.includes("full")) {
    sessionSplits.push("full");
  }

  return sessionSplits;
}

export function assignExercises(
  musclePriorityList: MusclePriorityType[],
  splitList: string[],
  allowableMuscles: Record<string, string[]>,
  totalMesocycles: number
) {
  const finalPlan: Record<number, Record<number, AssignedExercise[]>> = {};

  // 1. For each mesocycle, determine how many sessions to use
  const sessionsPerMeso: number[] = [];
  for (let meso = 0; meso < totalMesocycles; meso++) {
    if (meso === totalMesocycles - 1) {
      // Last mesocycle: use all sessions
      sessionsPerMeso[meso] = splitList.length;
    } else {
      // Use the highest frequency for this mesocycle
      let maxFreq = 0;
      for (const muscle of musclePriorityList) {
        const freq =
          muscle.frequency.progression[meso] ?? muscle.frequency.target;
        if (freq > maxFreq) maxFreq = freq;
      }
      sessionsPerMeso[meso] = maxFreq;
    }
  }

  console.log(sessionsPerMeso, splitList, totalMesocycles, "sessionsPerMeso");
  // 2. For each muscle, assign exercises to sessions for each mesocycle
  for (const muscle of musclePriorityList) {
    const allSessionIndices = getValidSessionIndicesForMuscle(
      splitList,
      allowableMuscles,
      muscle.muscle
    );

    for (let meso = 0; meso < totalMesocycles; meso++) {
      const freq =
        muscle.frequency.progression[meso] ?? muscle.frequency.target;
      const sessionCount = sessionsPerMeso[meso];

      // Only use the first N session indices for this mesocycle
      const sessionIndices = allSessionIndices.slice(0, sessionCount);

      // Sort by current load (least loaded first)
      const sessionExerciseCounts = sessionIndices.map((idx) => ({
        idx,
        count: finalPlan[meso]?.[idx]?.length ?? 0,
      }));
      sessionExerciseCounts.sort((a, b) => a.count - b.count);
      const sortedSessionIndices = sessionExerciseCounts.map((obj) => obj.idx);

      let sessionSplits: string[];
      if (meso === totalMesocycles - 1) {
        // Last mesocycle: use all sessions
        sessionSplits = [...splitList];
      } else {
        sessionSplits = getSessionSplitsForMesocycle(
          musclePriorityList,
          splitList,
          allowableMuscles,
          meso
        );
      }

      // Pick the first `freq` sessions with the least exercises
      const chosenSessions = sortedSessionIndices.slice(0, freq);

      if (!finalPlan[meso]) finalPlan[meso] = {};

      for (let i = 0; i < freq; i++) {
        const sessionIdx = chosenSessions[i];
        const exercises = muscle.exercises[i] ?? [];

        if (!finalPlan[meso][sessionIdx]) finalPlan[meso][sessionIdx] = [];
        finalPlan[meso][sessionIdx].push({
          session_index: sessionIdx,
          split: splitList[sessionIdx],
          exercises,
          muscle_name: muscle.muscle,
        });
      }
    }
  }

  return finalPlan;
}

// // Core function
// export function assignExercises(
//   musclePriorityList: MusclePriorityType[],
//   splitList: string[],
//   allowableMuscles: Record<string, string[]>,
//   totalMesocycles: number
// ) {
//   const finalPlan: Record<number, Record<number, AssignedExercise[]>> = {}; // meso -> session -> exercises

//   for (const muscle of musclePriorityList) {
//     const sessionIndices = getValidSessionIndicesForMuscle(
//       splitList,
//       allowableMuscles,
//       muscle.muscle
//     );
//     let assignedSessions = new Set<number>();

//     for (let meso = 0; meso < totalMesocycles; meso++) {
//       const freq =
//         muscle.frequency.progression[meso] ?? muscle.frequency.target;
//       const sessionExerciseCounts = sessionIndices.map((idx) => ({
//         idx,
//         count: finalPlan[meso]?.[idx]?.length ?? 0,
//       }));
//       sessionExerciseCounts.sort((a, b) => a.count - b.count);
//       const sortedSessionIndices = sessionExerciseCounts.map((obj) => obj.idx);

//       const chosenSessions = sortedSessionIndices.slice(0, freq);

//       assignedSessions = new Set([...assignedSessions, ...chosenSessions]);

//       if (!finalPlan[meso]) finalPlan[meso] = {};

//       for (let i = 0; i < freq; i++) {
//         const sessionIdx = chosenSessions[i];
//         const exerciseGroup = muscle.exercises[i] ?? [];

//         if (!finalPlan[meso][sessionIdx]) finalPlan[meso][sessionIdx] = [];
//         finalPlan[meso][sessionIdx].push({
//           sessionIndex: sessionIdx,
//           split: splitList[sessionIdx],
//           exerciseGroup,
//           muscle: muscle.muscle,
//         });
//       }
//     }
//   }

//   // Rebalance each mesocycle to even out compatible sessions grouped by split
//   // for (const meso of Object.keys(finalPlan)) {
//   //   const mesoIndex = Number(meso);
//   //   finalPlan[mesoIndex] = rebalanceExercisesInMesocycle(
//   //     finalPlan[mesoIndex],
//   //     splitList,
//   //     allowableMuscles
//   //   );
//   // }

//   return finalPlan; // [mesocycle][session] => AssignedExercise[]
// }

// NOTE: With this algorithm.
// 1. Start from top of muscle list.
// 2. Start with all splits available on last mesocycle, then fill each preceding meso.
// 3. For each meso:
//    a. If muscle is filled in previous meso then carry it over.
//    b. If muscle has not been filled then find least full session with default on the first available.

// meso 1
// upper = back, sdel, tris, fore, bics,
// upper = back, sdel, rdel, trap, chst,
// lower = hams, quad,

// meso 2
// upper = back, sdel, tris, rdel, fore, bics,
// upper = back, sdel, tris, rdel, trap, bics, chst,
// lower = hams, quad,
// full  = back, sdel, hams, quad, trap, chst,

// meso 3
// upper  = back, sdel, tris, rdel, fore, bics,
// upper  = back, sdel, tris, rdel, trap, bics, chst,
// lower  = hams, quad, calf,
// full   = back, sdel, tris, hams, quad, chst,
// full   = back, sdel, hams, quad, trap, calf

const sortValidSessions = (
  split_list: string[],
  valid_session_indices: number[]
) => {};

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

  let split_counts: Record<string, number> = {};
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
        allowable_muscles_per_split,
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

export const disperseExercisesIntoSessions = (
  muscle_priority_list: MusclePriorityType[],
  split_list: string[],
  allowable_muscles: Record<string, string[]>,
  mesocycles: number
) => {
  const final_plan: Record<number, Record<number, AssignedExercise[]>> = {};

  // 1. Modify the split_list to only include the necessary sessions per mesocycle.
  const max_frequencies = determineSessionsPerMesocycle(
    muscle_priority_list,
    split_list,
    mesocycles
  );

  // 2. Create the final mesocycle with all the splits in split_list and fill with empty exercises
  for (let j = 0; j < mesocycles; j++) {
    for (let i = 0; i < split_list.length; i++) {
      const valid_splits = max_frequencies[j];
      const selected_split = valid_splits[i];
      if (selected_split) {
        const split_index = selected_split.split("_")[1];
        final_plan[j] = { ...final_plan[j], [split_index]: [] };
      }
    }
  }

  console.log(split_list, final_plan, "WHAT THIS LOOK LIKE AT THIS TIME??");
  // TEST: 7/18/2025.
  // This function works pretty well for what I want, however, I want to add some
  // more structure to it. So I'll try building each mesocycle sequentially then copying over to next mesocycle.

  for (const muscle of muscle_priority_list) {
    const muscle_name = muscle.muscle;
    const frequency_progression = muscle.frequency.progression;
    const frequency_target = muscle.frequency.target;
    const exercises = muscle.exercises;

    for (let meso = frequency_progression.length - 1; meso >= 0; meso--) {
      const freq = frequency_progression[meso] ?? frequency_target;
      const session_indices = getValidSessionIndicesForMuscle(
        split_list,
        allowable_muscles,
        muscle_name
      );

      const filtered_indices = session_indices.filter((idx) => {
        const meso_sessions = max_frequencies[meso];
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
        count: final_plan[meso][idx]?.reduce(
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

        if (!final_plan[meso][session_idx]) final_plan[meso][session_idx] = [];
        final_plan[meso][session_idx].push({
          session_index: session_idx,
          split: split_list[session_idx],
          exercises: valid_exercises,
          muscle_name: muscle_name,
        });
      }
    }
  }

  const console_log_final_plan = buildConsoleLogFinalPlan(
    final_plan,
    split_list
  );
  console.log(
    max_frequencies,
    console_log_final_plan,
    final_plan,
    "final plan stateNormy"
  );
  return final_plan;
};

// NOTE: This function is only for testing outcomes via console.log
function buildConsoleLogFinalPlan(
  finalPlan: Record<number, Record<number, AssignedExercise[]>>,
  splitList: string[]
) {
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
}
