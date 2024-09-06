import { HTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/clsx";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        `flex h-[11px] w-[11px] items-center justify-center border border-primary-400 bg-primary-600 p-[2px] text-xxs text-white hover:bg-primary-500`,
        className
      )}
    >
      {children}
    </button>
  );
}

interface ValueProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
}

function Value({ value, className, ...props }: ValueProps) {
  return (
    <div
      {...props}
      className={cn(
        `flex w-3 items-center justify-center px-1 text-xxs text-white`,
        className
      )}
    >
      {value}
    </div>
  );
}

Counter.Value = Value;
Counter.Button = Button;
export default function Counter({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex w-11 items-center justify-center border-x-2 border-primary-600 px-1`}
    >
      {children}
    </div>
  );
}
