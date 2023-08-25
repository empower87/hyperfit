import { ReactNode, useState } from "react";

type PromptCardProps = {
  title: string;
  children: ReactNode;
};
const OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

export const FrequencySelectPrompts = () => {
  const [totalSessionsPerWeek, setTotalSessionsPerWeek] = useState<number>(3);
  const [totalDoubleSessionsPerWeek, setTotalDoubleSessionsPerWeek] =
    useState<number>(0);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const handleSelectChange = (value: number) => {
    if (showPrompt) {
      setTotalDoubleSessionsPerWeek(value);
    } else {
      setTotalSessionsPerWeek(value);
      setShowPrompt(true);
    }
  };

  return (
    <>
      <FrequencySelect
        title="Weekly Sessions: How many days per week you can train?"
        options={[...OPTIONS].slice(3)}
        onChange={handleSelectChange}
      />
      {showPrompt && (
        <FrequencySelect
          title="Weekly Sessions: How many days per week you can train?"
          options={[...OPTIONS].slice(0, totalSessionsPerWeek - 1)}
          onChange={handleSelectChange}
        />
      )}
    </>
  );
};

export const FrequencySelect = ({
  title,
  options,
  onChange,
}: {
  title: string;
  options: number[];
  onChange: (value: number, type: "week" | "day") => void;
}) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);
    const type =
      title === "Weekly Sessions: How many days per week you can train?"
        ? "week"
        : "day";
    onChange(selectedValue, type);
  };
  return (
    <>
      <p className="p-1 text-slate-700">{title}</p>

      <select onChange={handleSelectChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 7 ? `${option}: Not Recommended` : option}
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
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}

// LOGISTICS 2.0

// 1. Prompt user for total sessions they can commit to a week.
//    - this will allow to structure the plan to take priority muscle from mev to mrv.

// 2. Check priority list.
//    Options: allow for user to progressively overload all muscles at the same time.
