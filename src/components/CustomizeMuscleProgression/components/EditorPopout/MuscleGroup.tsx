const TEST_DATA = {
  id: "back-002",
  muscle: "back",
  exercises: [[], [], [], []],
  volume: {
    landmark: "MRV",
    exercisesPerSessionSchema: 2,
  },
  frequency: {
    range: [3, 4],
    target: 0,
    progression: [2, 3, 4],
    setProgressionMatrix: [[], [], []],
  },
};

export default function MuscleGroup() {
  return <div></div>;
}
