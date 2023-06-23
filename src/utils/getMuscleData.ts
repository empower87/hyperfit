import data from "src/constants/muscle-data.json";

export const getMuscleData = (name: string) => {
  const muscleData = data.filter((each) => each.name === name);
  return muscleData[0];
};
