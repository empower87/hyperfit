type ListTuple = [string, number];

const SORTED_PRIORITY_LIST: ListTuple[] = [
  ["back", 25],
  ["triceps", 20],
  ["delts (side)", 25],
  ["delts (rear)", 25],
  ["traps", 12],
  ["chest", 8],
  ["biceps", 8],
  ["quads", 30],
  ["hamstrings", 18],
  ["glutes", 12],
];

type PrioritizeFocusProps = {
  totalSessions: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  priority: "upper" | "lower";
};

export default function PrioritizeFocus({
  totalSessions,
  priority,
}: PrioritizeFocusProps) {
  return (
    <ul>
      {SORTED_PRIORITY_LIST.map((each, index) => {
        return <li key={`${each[0]}+${index}`}>{each[0]}</li>;
      })}
    </ul>
  );
}
