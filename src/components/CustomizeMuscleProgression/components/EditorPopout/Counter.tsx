import {
  ChangeEvent,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { cn } from "~/lib/clsx";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "sm" | "md" | "lg";
}
export function Button({
  children,
  className,
  variant,
  ...props
}: ButtonProps) {
  const DEFAULT = "h-4 w-4";
  const MD = "h-5 w-5";
  const LG = "h-6 w-6";
  const sizeVariant = variant === "lg" ? LG : variant === "md" ? MD : DEFAULT;
  return (
    <button
      {...props}
      className={cn(
        `flex ${sizeVariant} items-center justify-center rounded border border-primary-400 bg-primary-600 p-[2px] text-xxs text-white hover:bg-primary-500`,
        className
      )}
    >
      {children}
    </button>
  );
}

interface ValueProps extends HTMLAttributes<HTMLInputElement> {
  value: number;
}
const Value = forwardRef<HTMLInputElement, ValueProps>((props, ref) => {
  const [value, setValue] = useState<string>(props.value.toString());
  const [width, setWidth] = useState<string>("w-4");

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  useEffect(() => {
    const length = value.length;
    const width = length < 2 ? "w-4" : length < 3 ? "w-5" : "w-7";
    setWidth(width);
  }, [value]);

  return (
    <input
      {...props}
      ref={ref}
      type="text"
      className={cn(
        `flex ${width} items-center justify-center rounded border border-primary-500 bg-primary-500 px-1 text-xs 
        text-white outline-none focus:border-secondary-300`,
        props.className
      )}
      value={value}
      onChange={onChangeHandler}
    />
  );
});

Counter.Value = Value;
Counter.Button = Button;
export default function Counter({ children }: { children: ReactNode }) {
  return <div className={`flex items-center justify-center`}>{children}</div>;
}
