const getKeyWithHighestValue = <TObj extends Record<string, number>>(
  obj: TObj
): { key: keyof TObj; value: number } => {
  const keys = Object.keys(obj) as Array<keyof TObj>;
  let highestKey = keys[0] as keyof TObj;
  let highestValue = obj[highestKey];

  for (const key of keys) {
    if (obj[key] > highestValue) {
      highestKey = key;
      highestValue = obj[key];
    }
  }
  return { key: highestKey, value: highestValue };
};

function divideRatioIntoSessionsPPL(push: number, legs: number, pull: number) {
  let PPL = {
    push: push,
    legs: legs,
    pull: pull,
  };

  let total = Math.round(push + legs + pull);

  if (total <= 1) {
    let { key } = getKeyWithHighestValue(PPL);
    PPL = { ...PPL, [key]: PPL[key] + 1 };
  } else {
    // lol my logic sucks
    let highestKey: keyof typeof PPL = "push";
    let secondHighestKey: keyof typeof PPL = "pull";

    let first = getKeyWithHighestValue(PPL);
    highestKey = first.key;

    let newPPL = { ...PPL, [highestKey]: 0 };
    let second = getKeyWithHighestValue(newPPL);
    secondHighestKey = second.key;

    PPL = {
      ...PPL,
      [highestKey]: PPL[highestKey] + 1,
      [secondHighestKey]: PPL[secondHighestKey] + 1,
    };
  }

  return PPL;
}
