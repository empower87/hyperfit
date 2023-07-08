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

  let week1: [string, number, number, number][] = [];
  let week2: [string, number, number, number][] = [];
  let week3: [string, number, number, number][] = [];
  let week4: [string, number, number, number][] = [];
  let deload: [string, number, number, number][] = [];

  let tableMatrix: [string, number, number, number][][] = [
    week1,
    week2,
    week3,
    week4,
    deload,
  ];

  const check = (
    muscle: string,
    sets: number,
    subtraction: number,
    weight: number,
    rir: number
  ): [string, number, number, number] => {
    let microcycleSets = sets - subtraction;

    if (sets === 0) return [muscle, 0, 0, 0];
    if (sets === 2) return [muscle, 2, weight, rir];
    if (sets === 3) return [muscle, 3, weight, rir];
    if (microcycleSets < 2) return [muscle, 2, weight, rir];
    else {
      return [muscle, microcycleSets, weight, rir];
    }
  };

  const deloadCheck = (
    muscle: string,
    sets: number,
    weight: number
  ): [string, number, number, number] => {
    if (sets === 0) return [muscle, 0, 0, 0];
    if (sets === 2 || sets === 3 || sets === 4 || sets === 5)
      return [muscle, 2, weight, 5];
    else {
      return [muscle, 4, weight, 5];
    }
  };

  const checkPreviousIndex = () => {};

  while (total > 0) {
    let index = total - 1;

    for (let i = 0; i < sets.length; i++) {
      // handle deload
      if (index === 4) {
        const values = deloadCheck(sets[i][0], sets[i][1], weight - 15);
        deload.push(values);
      } else if (index === 3) {
        const values = check(sets[i][0], sets[i][1], 0, weight, rir);
        week4.push(values);
      } else if (index === 2) {
        let subtraction = 1;
        if (sets[i - 1] && sets[i][0] === sets[i - 1][0]) {
          subtraction = 0;
        }
        const values = check(
          sets[i][0],
          sets[i][1],
          subtraction,
          weight - 5,
          rir + 1
        );
        week3.push(values);
      } else if (index === 1) {
        let subtraction = 2;
        if (sets[i - 1] && sets[i][0] === sets[i - 1][0]) {
          subtraction = 1;
        }
        const values = check(
          sets[i][0],
          sets[i][1],
          subtraction,
          weight - 10,
          rir + 2
        );
        week2.push(values);
      } else {
        let subtraction = 3;
        if (sets[i - 1] && sets[i][0] === sets[i - 1][0]) {
          subtraction = 2;
        }
        let values = check(
          sets[i][0],
          sets[i][1],
          subtraction,
          weight - 15,
          rir + 3
        );
        values.splice(2, 0, 12);
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
