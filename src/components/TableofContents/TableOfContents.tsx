import { BORDER_COLOR_M6 } from "~/constants/themes";

const CONTENTS = [
  {
    title: "Configuration",
    children: [],
  },
  {
    title: "Muscle Editor",
    children: [],
  },
  {
    title: "Exercise Editor",
    children: [],
  },
  {
    title: "Training Block",
    children: [],
  },
];
export default function TableOfContents() {
  return (
    <div className={`flex flex-col ${BORDER_COLOR_M6} rounded border-2 p-1`}>
      <h1 className={`text-white`}>Table of Contents</h1>
      <div className={`flex flex-col space-y-1`}></div>
    </div>
  );
}
