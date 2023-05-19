import { ReactNode } from "react";

type LiftProps = {
  sets: number;
  category: string;
  lift: string;
};

// not as elegant or reuseable lol but whatever
const splitSets = (sets: number) => {
  if (sets === 0 || sets > 12) return [0];
  switch (sets) {
    case 12:
      return [4, 4, 4];
    case 11:
      return [4, 4, 3];
    case 10:
      return [4, 3, 3];
    case 9:
      return [5, 4];
    case 8:
      return [4, 4];
    case 7:
      return [4, 3];
    case 6:
      return [3, 3];
    default:
      return [sets];
  }
};

export default function Lift({ sets, category, lift }: LiftProps) {
  const lifts = splitSets(sets);
  return (
    <>
      {lifts.map((each) => {
        return (
          <tr>
            <td>{each}</td>
            <td>{category}</td>
            <td>{lift}</td>
          </tr>
        );
      })}
    </>
  );
}

export function LiftTable({ children }: { children: ReactNode }) {
  return (
    <li>
      <table>
        <thead>
          <tr>
            <th>Sets</th>
            <th>Category</th>
            <th>Lift</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </li>
  );
}
