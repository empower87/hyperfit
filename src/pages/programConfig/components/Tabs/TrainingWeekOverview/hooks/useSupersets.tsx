import { createContext, ReactNode, useContext, useState } from "react";
import { DraggableExercises } from "./useExerciseSelection";

type Supersets = ReturnType<typeof useSupersets>;

const SupersetsContext = createContext<Supersets | null>(null);

type SupersetProviderProps = {
  trainingWeek: DraggableExercises[];
  children: ReactNode;
};

export const SupersetsProvider = ({
  trainingWeek,
  children,
}: SupersetProviderProps) => {
  const values = useSupersets(trainingWeek);

  return (
    <SupersetsContext.Provider value={values}>
      {children}
    </SupersetsContext.Provider>
  );
};

export const useSupersetsContext = () => {
  const values =  useContext(SupersetsContext);
  if (!values) throw new Error("SupersetsContext not found");
  return values
};

type SupersetMapType = [string, string, string];
const useSupersets = (trainingWeek: DraggableExercises[]) => {
  const [supersets, setSupersets] = useState<SupersetMapType[]>([]);

  const addSuperset = (
    exercise1Id: string,
    exercise2Id: string,
    sessionId: string
  ) => {
    const filterOutExistingSuperset = supersets.filter(
      (superset) => superset[0] !== sessionId
    );
    setSupersets([
      ...filterOutExistingSuperset,
      [sessionId, exercise1Id, exercise2Id],
    ]);
  };

  return {
    supersets,
    addSuperset,
  };
};
