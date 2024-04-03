import { useEffect, useRef, useState } from "react";
import { FULL_BODY_MUSCLES } from "~/constants/workoutSplits";

export function useHeadsObserver() {
  const observer = useRef<IntersectionObserver | null>(null);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleObsever = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObsever, {
      rootMargin: "-10% 0% -75% 0px",
    });

    const muscles: string = FULL_BODY_MUSCLES.map(
      (each) => ` #${each}`
    ).toString();
    const elements = document.querySelectorAll(
      `#configuration,${muscles}, #exercise_editor, #training_block`
    );

    elements.forEach((elem) => observer.current?.observe(elem));
    return () => observer.current?.disconnect();
  }, []);

  return { activeId };
}
