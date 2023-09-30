import { ReactNode, useState } from "react";

type PromptCardProps = {
  title: string;
  children: ReactNode;
};
const OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

export const FrequencySelectPrompts = ({
  onClick,
}: {
  onClick: (first: number, second: number) => void;
}) => {
  const [totalSessionsPerWeek, setTotalSessionsPerWeek] = useState<number>(3);
  const [totalDoubleSessionsPerWeek, setTotalDoubleSessionsPerWeek] =
    useState<number>(0);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const handleSelectChange = (value: number, type: "week" | "day") => {
    if (type === "day") {
      setTotalDoubleSessionsPerWeek(value);
    } else {
      setTotalSessionsPerWeek(value);
      setShowPrompt(true);
    }
  };

  const onClickHandler = () => {
    onClick(totalSessionsPerWeek, totalDoubleSessionsPerWeek);
  };

  return (
    <div className="flex h-full flex-col">
      <FrequencySelect
        title="Weekly Sessions: "
        options={[...OPTIONS].slice(3)}
        onChange={handleSelectChange}
      />
      {showPrompt && (
        <FrequencySelect
          title="Daily Sessions: "
          options={[...OPTIONS].slice(0, totalSessionsPerWeek + 1)}
          onChange={handleSelectChange}
        />
      )}
      {showPrompt && (
        <div className="flex h-1/3 items-center justify-center">
          <button
            className="rounded bg-slate-700 p-1 text-xs font-bold text-white hover:bg-slate-500"
            style={{ height: "80%", width: "95%" }}
            onClick={() => onClickHandler()}
          >
            Get Training Block
          </button>
        </div>
      )}
    </div>
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
    const type = title === "Weekly Sessions: " ? "week" : "day";
    onChange(selectedValue, type);
  };

  return (
    <div className="flex h-1/3">
      <p className="w-5/6 p-1 text-xs leading-3 text-slate-700">{title}</p>

      <select className="w-1/6" onChange={handleSelectChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 7 ? `${option}: Not Recommended` : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default function PromptCardLayout({ title, children }: PromptCardProps) {
  return (
    <div className="flex h-1/5 w-full items-end justify-center">
      <div
        className="flex flex-col rounded border-2 border-slate-500"
        style={{ height: "94%", width: "92%" }}
      >
        <div className="flex h-6 w-full items-center rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

// GOALS:

// WAIST: 33;
// ARMS: 17;
// LEGS: 26;
