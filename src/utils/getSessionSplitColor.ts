export const getSessionSplitColor = (
  split: "off" | "push" | "pull" | "upper" | "lower" | "full" | ""
) => {
  switch (split) {
    case "off":
      return {
        text: "text-slate-400",
        bg: "bg-slate-400",
      };
    case "upper":
      return {
        text: "text-blue-500",
        bg: "bg-blue-500",
      };
    case "lower":
      return {
        text: "text-red-500",
        bg: "bg-red-500",
      };
    case "full":
      return {
        text: "text-purple-500",
        bg: "bg-purple-500",
      };
    default:
      return {
        text: "text-blue-300",
        bg: "bg-blue-300",
      };
  }
};
