export const getKeyWithHighestValue = <TObj extends Record<string, number>>(
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
