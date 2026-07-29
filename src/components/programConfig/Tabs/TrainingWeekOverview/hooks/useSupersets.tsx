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
  const values = useContext(SupersetsContext);
  if (!values) throw new Error("SupersetsContext not found");
  return values;
};

type SupersetsMap = Record<string, [string, string]>;
const useSupersets = (trainingWeek: DraggableExercises[]) => {
  // key: supersetId, value: [exerciseId1, exerciseId2]
  const [supersets, setSupersets] = useState<SupersetsMap>({});

  // Generate a unique superset key from exercise IDs
  const getSupersetKey = (id1: string, id2: string) => {
    return [id1, id2].sort().join("_");
  };

  // Add or overwrite a superset
  const addSuperset = (
    exercise1Id: string,
    exercise2Id: string,
    _sessionId?: string
  ) => {
    // Remove any supersets containing either exercise
    const newSupersets: SupersetsMap = {};
    Object.entries(supersets).forEach(([key, arr]) => {
      if (!arr.includes(exercise1Id) && !arr.includes(exercise2Id)) {
        newSupersets[key] = arr;
      }
    });
    const newKey = getSupersetKey(exercise1Id, exercise2Id);
    newSupersets[newKey] = [exercise1Id, exercise2Id];
    setSupersets(newSupersets);
  };

  // Remove a superset by key
  const breakSuperset = (supersetKey: string) => {
    const newSupersets = { ...supersets };
    delete newSupersets[supersetKey];
    setSupersets(newSupersets);
  };

  return {
    supersets,
    addSuperset,
    breakSuperset,
  };
};
