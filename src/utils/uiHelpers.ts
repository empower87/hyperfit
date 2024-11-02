export const capitalizeFirstLetter = (string: string) => {
  const capitalized = string.charAt(0).toUpperCase();
  return capitalized + string.slice(1);
};

export const capitalizeFirstCharInString = (string: string) => {
  const splitString = string.split(" ");
  const capitalizeLetters = splitString.map((subStr) =>
    capitalizeFirstLetter(subStr)
  );
  const combineIntoString = capitalizeLetters.join(" ");
  return combineIntoString;
};
