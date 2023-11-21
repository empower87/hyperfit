import { ReactNode } from "react";
import { BG_COLOR_M8 } from "~/utils/themes";

const OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];
const SPLITS = [
  "optimized",
  "custom",
  "push / pull / legs",
  "upper / lower",
  "bro",
  "push / pull / legs - upper / lower",
  "full body",
];

type SelectProps<T> = {
  selectedOption: T;
  options: T[];
  onSelect: (value: T) => void;
};

function Select<T extends string | number>({
  selectedOption,
  options,
  onSelect,
}: SelectProps<T>): ReactNode {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);
    const type = title === "Weekly Sessions: " ? "week" : "day";
    onSelect(event.target.value as T);
  };
  return (
    <select className={BG_COLOR_M8 + " text-white"} onChange={onSelect}>
      {options.map((each) => {
        return (
          <option
            value={each}
            selected={selectedOption === each ? true : false}
          >
            {each}
          </option>
        );
      })}
    </select>
  );
}

const FrequencySelect = ({
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
      <p className="w-4/5 p-1 text-xs leading-3 text-slate-300">{title}</p>
      {/* <Select
        selectedOption={}
        options={}
        onSelect={}
      
      /> */}

      <select
        className={BG_COLOR_M8 + " w-1/5 text-white"}
        onChange={handleSelectChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 7 ? `${option}: Not Recommended` : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export const FrequencySelectPrompts = ({
  totalSessionsPerWeek,
  onClick,
}: {
  totalSessionsPerWeek: number;
  onClick: (value: number, type: "week" | "day") => void;
}) => {
  return (
    <div className="flex flex-col">
      <FrequencySelect
        title="Weekly Sessions: "
        options={[...OPTIONS].slice(3)}
        onChange={onClick}
      />

      <FrequencySelect
        title="Daily Sessions: "
        options={[...OPTIONS].slice(0, totalSessionsPerWeek + 1)}
        onChange={onClick}
      />
    </div>
  );
};
