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
        How many days per week will you being lifting?
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
      <div className="w-3/4 rounded border-2 border-slate-500">
        <div className="w-full rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">{title}</h2>
        </div>
        <div className="flex">{children}</div>
      </div>
    </div>
  );
}
