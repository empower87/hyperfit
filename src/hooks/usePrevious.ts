import { useEffect, useRef } from "react";

// Given any value
// This hook will return the previous value
// Whenever the current value changes

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
