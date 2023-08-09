import { ReactNode } from "react";

const TOTAL_WORKOUTS = [1, 2, 3, 4, 5, 6, 7];

type PromptCardProps = {
  title: string;
  children: ReactNode;
};

export const FrequencySelect = ({
  onChange,
}: {
  onChange: (value: number) => void;
}) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);
    onChange(selectedValue);
  };
  return (
    <>
      <p className="p-1 text-slate-700">
        Max sessions you can ideally commit to:
        {/* --- this should probably be the max amount of sessions a week so as to progress toward --- */}
      </p>

      <select onChange={handleSelectChange}>
        {TOTAL_WORKOUTS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};

export default function PromptCardLayout({ title, children }: PromptCardProps) {
  return (
    <div className="mt-4 flex justify-center">
      <div className="w-11/12 rounded border-2 border-slate-500">
        <div className="w-full rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">{title}</h2>
        </div>
        <div className="flex">{children}</div>
      </div>
    </div>
  );
}

// LOGISTICS 2.0

// 1. Prompt user for total sessions they can commit to a week.
//    - this will allow to structure the plan to take priority muscle from mev to mrv.

// 2. Check priority list.
//    Options: allow for user to progressively overload all muscles at the same time.
