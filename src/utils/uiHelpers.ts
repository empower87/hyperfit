export const capitalizeFirstLetter = (string: string) => {
  const capitalized = string.charAt(0).toUpperCase();
  return capitalized + string.slice(1);
};
