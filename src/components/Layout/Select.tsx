import { HTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/clsx";

interface SelectProps<T> extends HTMLAttributes<HTMLSelectElement> {
  selectedOption: T;
  options: T[];
  onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Select<T extends string | number>({
  selectedOption,
  options,
  onSelect,
  className,
  ...props
}: SelectProps<T>) {
  return (
    <select
      {...props}
      className={cn(
        `h-full w-full bg-inherit text-white border-primary-500 rounded border text-xs outline-slate-700`,
        className
      )}
      onChange={onSelect}
    >
      {options.map((each, index) => {
        return (
          <option
            key={`${each}_${index}_select`}
            className={`bg-primary-600`}
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
    <div className="flex w-60 justify-between p-0.5">
      <p className="text-xs leading-3 text-slate-400">{label}</p>
      <div className="flex w-10">{children}</div>
    </div>
  );
}
