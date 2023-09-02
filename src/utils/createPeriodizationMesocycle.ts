import { MusclePriorityType } from "~/pages";

const subtractSetsForMeso = (sets: [string, number][]) => {
  // let count = setsToSubtract

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

const MUSCLE = {
  session: "upper",
  name: "back",
  exercises: [],
};
const SESSION = {
  session: "upper",
};

const finalMeso = (list: MusclePriorityType[], sessions: number[]) => {
  for (let i = 0; i < list.length; i++) {}
};

//  meso 1  |  wk 1  |  wk 2  |  wk 3  |  wk 4  |  deload
//  =======================================================
//  back    |    8   |   10   |   12   |   14   |
//  delts_s |    8   |   10   |   12   |   14   |
//  triceps |    4   |    6   |    8   |   10   |
//  hams    |    5   |    6   |    7   |    8   |

//  quads   |    6   |    7   |    7   |    8   |
//  chest   |    3   |    4   |    5   |    6   |
//  biceps  |    3   |    4   |    5   |    6   |
//  calves  |    6   |    7   |    7   |    8   |
//  traps   |    2   |    3   |    3   |    4   |

//  meso 2  |  wk 1  |  wk 2  |  wk 3  |  wk 4  |  deload
//  =======================================================
//  back    |   14   |   17   |   20   |   23   |
//  delts_s |   14   |   17   |   20   |   23   |
//  triceps |    7   |    9   |   11   |   12   |
//  hams    |    7   |    9   |   11   |   12   |

//  quads   |    7   |    7   |    8   |    8   |
//  chest   |    4   |    5   |    6   |    6   |
//  biceps  |    4   |    5   |    6   |    6   |
//  calves  |    7   |    7   |    8   |    8   |
//  traps   |    3   |    3   |    4   |    4   |

//  meso 2  |  wk 1  |  wk 2  |  wk 3  |  wk 4  |  deload
//  =======================================================
//  back    |   19   |   22   |   26   |   30   |
//  delts_s |   19   |   22   |   26   |   30   |
//  triceps |   11   |   14   |   17   |   20   |
//  hams    |   11   |   14   |   17   |   20   |

//  quads   |    7   |    8   |    8   |    8   |
//  chest   |    5   |    6   |    6   |    6   |
//  biceps  |    5   |    6   |    6   |    6   |
//  calves  |    7   |    8   |    8   |    8   |
//  traps   |    3   |    4   |    4   |    4   |

//  meso 2  |  wk 1  |  wk 2  |  wk 3  |  wk 4  |  deload
//  =======================================================
//  back    |   14   |   17   |   20   |   23   |
//  chest   |   5    |   5    |    6   |    6   |
//  triceps |   12   |   14   |   15   |   16   |
//  biceps  |   5    |   5    |    6   |    6   |
//  delts   |   14   |   17   |   20   |   23   |
//  quads   |   14   |   16   |   16   |   18   |
//  hams    |        |        |        |        |
//  calves  |        |        |        |        |

//  meso 3  |  wk 1  |  wk 2  |  wk 3  |  wk 4  |  deload
//  =======================================================
//  back    |   22   |   23   |   24   |   25   |
//  chest   |    6   |    6   |    6   |    6   |
//  triceps |   16   |   18   |   18   |   20   |
//  biceps  |    6   |    6   |    6   |    6   |
//  delts   |   20   |   23   |   25   |   27   |
//  quads   |   18   |   20   |   20   |   22   |
//  hams    |        |        |        |        |
//  calves  |        |        |        |        |
