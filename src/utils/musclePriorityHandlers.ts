import {
  type MusclePriorityType,
  type VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

import { getMuscleData } from "./getMuscleData";

export const updateMusclePriorityVolume = (
  list: MusclePriorityType[],
  mrv_breakpoint: number,
  mev_breakpoint: number
) => {
  const updateList = [...list];
  for (let i = 0; i < updateList.length; i++) {
    if (i < mrv_breakpoint) {
      updateList[i].volume.landmark = "MRV";
    } else if (i >= mrv_breakpoint && i < mev_breakpoint) {
      updateList[i].volume.landmark = "MEV";
    } else {
      updateList[i].volume.landmark = "MV";
    }
  }
  return updateList;
};

export const getEndOfMesocycleVolume = (
  group: string,
  frequency: number,
  volume_landmark: VolumeLandmarkType
) => {
  if (frequency === 0) return 0;
  const muscleData = getMuscleData(group);
  const key =
    volume_landmark === "MRV"
      ? "mrv_progression_matrix"
      : volume_landmark === "MEV"
      ? "mev_progression_matrix"
      : "mv_progression_matrix";
  const volFrequency = muscleData[key];

  if (!volFrequency.length) return 0;
  const frequencyList =
    volFrequency[frequency - 1] ?? volFrequency[volFrequency.length - 1];

  let count = 0;
  for (let i = 0; i < frequencyList.length; i++) {
    const sets = frequencyList[i].split("-");

    sets.forEach((each) => {
      count = count + parseInt(each);
    });
  }

  const numberOfMesocycles = 3;
  const addSets = numberOfMesocycles * frequency;

  const totalVolume = addSets + count;

  if (key === "mv_progression_matrix") return count;
  return totalVolume;
};

export const getVolumeSets = (
  group: string,
  frequency: number,
  volume_landmark: VolumeLandmarkType
) => {
  const muscleData = getMuscleData(group);
  const volFrequency = muscleData[volume_landmark];

  if (typeof volFrequency !== "number") {
    return volFrequency[frequency - 1];
  } else {
    return volFrequency;
  }
};
