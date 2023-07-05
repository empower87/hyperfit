import { SessionType } from "~/pages";
import { getMuscleData } from "./getMuscleData";

export const mesocycleProgression = (workoutSplit: SessionType[]) => {};

const progressMEVmeso1 = (name: string) => {
  const data = getMuscleData(name);
};

export const subtractSetsForMeso = (sets: [string, number][]) => {
  // let count = setsToSubtact

  let total = 5;
  let weight = 250;
  let rir = 0;

  let week1: number[][] = [];
  let week2: number[][] = [];
  let week3: number[][] = [];
  let week4: number[][] = [];
  let deload: number[][] = [];

  let tableMatrix: number[][][] = [week1, week2, week3, week4, deload];
  const check = (
    sets: number,
    subtraction: number,
    weight: number,
    rir: number
  ) => {
    let microcycleSets = sets - subtraction;

    if (sets === 0) return [0, 0, 0];
    if (sets === 2) return [2, weight, rir];
    if (sets === 3) return [3, weight, rir];
    if (microcycleSets < 2) return [2, weight, rir];
    else {
      return [microcycleSets, weight, rir];
    }
  };
  const deloadCheck = (sets: number, weight: number) => {
    if (sets === 0) return [0, 0, 0];
    if (sets === 2 || sets === 3 || sets === 4 || sets === 5)
      return [2, weight, 5];
    else {
      return [4, weight, 5];
    }
  };

  while (total > 0) {
    let index = total - 1;

    for (let i = 0; i < sets.length; i++) {
      // handle deload
      if (index === 4) {
        const values = deloadCheck(sets[i][1], weight - 15);
        deload.push(values);
      } else if (index === 3) {
        const values = check(sets[i][1], 0, weight, rir);
        week4.push(values);
      } else if (index === 2) {
        const values = check(sets[i][1], 1, weight - 5, rir + 1);
        week3.push(values);
      } else if (index === 1) {
        const values = check(sets[i][1], 2, weight - 10, rir + 2);
        week2.push(values);
      } else {
        let values = check(sets[i][1], 3, weight - 15, rir + 3);
        values.splice(1, 0, 12);
        week1.push(values);
      }
    }
    total--;
  }
  console.log(
    tableMatrix,
    "WEEKLY PROGRESSION FUNCTION, checking the table matrix"
  );
  return tableMatrix;
};
