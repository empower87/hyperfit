import { ReactNode } from "react";
import { BORDER_COLOR_M5 } from "~/constants/themes";
import { cn } from "~/lib/clsx";

type SelectProps<T> = {
  selectedOption: T;
  options: T[];
  onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function Select<T extends string | number>({
  selectedOption,
  options,
  onSelect,
}: SelectProps<T>) {
  return (
    <select
      className={cn(
        `h-full w-full bg-inherit text-white ${BORDER_COLOR_M5} rounded border text-sm`
      )}
      onChange={onSelect}
    >
      {options.map((each, index) => {
        return (
          <option
            key={`${each}_${index}_select`}
            value={each}
            selected={each === selectedOption}
          >
            {each}
          </option>
        );
      })}
    </select>
  );
}

export function SelectLabel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-60 justify-between p-1">
      <p className="text-xs leading-3 text-slate-400">{label}</p>
      <div className="flex w-10">{children}</div>
    </div>
  );
}
