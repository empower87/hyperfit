import { useEffect, useState } from "react";

export default function useFrequencyEditor(
  mesoProgression: number[],
  total: [number, number]
) {
  const [canAddList, setCanAddList] = useState<boolean[]>([true, true, true]);
  const [canSubList, setCanSubList] = useState<boolean[]>([true, true, true]);
  const [currentMesoProgression, setCurrentMesoProgression] = useState<
    number[]
  >([...mesoProgression]);

  const canAddHandler = (mesoProgression: number[], max: number) => {
    const canAdds: boolean[] = [];
    for (let i = 0; i < mesoProgression.length; i++) {
      const currentElement = mesoProgression[i];
      const nextElement = mesoProgression[i + 1];

      if (nextElement) {
        if (currentElement < nextElement) {
          canAdds.push(true);
        } else {
          canAdds.push(false);
        }
      } else {
        if (currentElement < max) {
          canAdds.push(true);
        } else {
          canAdds.push(false);
        }
      }
    }
    return canAdds;
  };

  const canSubHandler = (mesoProgression: number[]) => {
    const canSubs: boolean[] = [];
    for (let i = 0; i < mesoProgression.length; i++) {
      const currentElement = mesoProgression[i];
      const prevElement = mesoProgression[i - 1];

      if (prevElement) {
        if (currentElement > prevElement) {
          canSubs.push(true);
        } else {
          canSubs.push(false);
        }
      } else {
        if (currentElement > 0) {
          canSubs.push(true);
        } else {
          canSubs.push(false);
        }
      }
    }
    return canSubs;
  };

  const onAddSubHandler = (type: "add" | "sub", mesocycle: number) => {
    const mesocycleIndex = mesocycle - 1;
    const mesoProg = [...currentMesoProgression];

    let newValue = mesoProg[mesocycleIndex] + 1;
    if (type === "sub") {
      newValue = mesoProg[mesocycleIndex] - 1;
    }
    mesoProg[mesocycleIndex] = newValue;

    setCurrentMesoProgression(mesoProg);
  };

  useEffect(() => {
    const max = total[0] + total[1];
    const addBools = canAddHandler(currentMesoProgression, max);
    const subBools = canSubHandler(currentMesoProgression);
    setCanAddList(addBools);
    setCanSubList(subBools);
  }, [currentMesoProgression]);

  return {
    canAddList,
    canSubList,
    onAddSubHandler,
    currentMesoProgression,
  };
}
