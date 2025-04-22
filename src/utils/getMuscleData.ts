import data from "src/constants/muscle-data.json";
import muscleJson from "src/constants/muscles/muscle-data.json";

export const getMuscleData = (name: string) => {
  const muscleData = data.filter((each) => each.name === name);
  return muscleData[0];
};

// NOTE: 4/22/2025. For newly updated JSON.
export const getJSONMuscle = (name: string) => {
  const muscleData = muscleJson.filter((each) => each.name === name);
  return muscleData[0];
};
