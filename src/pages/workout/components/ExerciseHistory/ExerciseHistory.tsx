export function ExerciseHistory() {
  return (
    <div className="w-[360px]">
      <div className="flex p-2">History</div>
    </div>
  );
}

// --- (1/15/25) TESTING MOCK DATA FOR EXERCISE HISTORY ---

const SESSION_EXERCISE_DATA = {
  session_id: "session_1",
  exercise_id: "exercise_1",
  sets: [
    {
      set_num: 1,
      reps: 12,
      weight: 100,
      rir: 3,
      isCompleted: true,
    },
    {
      set_num: 2,
      reps: 11,
      weight: 100,
      rir: 3,
      isCompleted: true,
    },
    {
      set_num: 3,
      reps: 12,
      weight: 100,
      rir: 3,
      isCompleted: true,
    },
    {
      set_num: 3,
      reps: 12,
      weight: 100,
      rir: 3,
      isCompleted: false,
    },
  ],
};

const PREV_EXERCISE_DATA = [{}];
