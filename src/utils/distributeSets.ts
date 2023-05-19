export default function distributeSets() {}

const days = 7;

const dayslol = (days: number) => {
  switch (days) {
    case 1:
    // U or L
    case 2:
    // UL
    case 3:
    // ULU or LUL or PLP
    case 4:
    // ULUL or PLP L or PLP U
    case 5:
    // ULULU or LULUL or PLP UL or PLP LP or PLP PL
    case 6:
    // PLP PLP or UL UL UL
    case 7:
    // PLP PLP U | L or UL UL UL U or LU LU LU L
    default:
      return;
  }
};

// TODO: Take in the priority list.
// this should get the days required for each to be maximized
// first off get the split between upper and lower so
// get highest upper priority and highest lower priority and find what's bigger and divide
// accordingly amongst days.
