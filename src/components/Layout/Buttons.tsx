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
        `flex items-center justify-center px-2 py-1 text-xs`,
        className
      )}
    >
      {children}
    </button>
  );
}
