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
        `flex h-4 w-4 items-center justify-center border border-primary-400 bg-primary-600 p-[2px] text-xxs text-white hover:bg-primary-500`,
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
        `flex items-center justify-center px-1 text-xs text-white`,
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
    <div className={`flex items-center justify-center px-1`}>{children}</div>
  );
}
