import {
  ChangeEvent,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
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
  variant?: "sm" | "md" | "lg";
}
const Value = forwardRef<HTMLInputElement, ValueProps>((props, ref) => {
  const [value, setValue] = useState<string>(props.value.toString());
  const [width, setWidth] = useState<number>(1);
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const DEFAULT = "h-4";
  const MD = "h-5";
  const LG = "h-6";
  const sizeVariant =
    props.variant === "lg" ? LG : props.variant === "md" ? MD : DEFAULT;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setWidth(newValue.length + 2);
    setValue(newValue);
  };

  useEffect(() => {
    const valueString = props.value.toString();
    const valueLength = valueString.length;
    const width = valueLength + 1;
    setValue(valueString);
    setWidth(width);
  }, [props.value]);

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      className={cn(
        `${sizeVariant} flex w-8 items-center justify-center rounded border border-primary-500 bg-primary-500 text-center 
        text-xs text-white outline-none focus:border-secondary-300`,
        props.className
      )}
      // style={{ width: `${width}ch` }}
      value={value}
      onChange={onChangeHandler}
    />
  );
});

Counter.Value = Value;
Counter.Button = Button;
export default function Counter({ children }: { children: ReactNode }) {
  return (
    <div className={`flex items-center justify-center space-x-0.5`}>
      {children}
    </div>
  );
}
