import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type TrainingProgramParamsType = ReturnType<typeof useTrainingProgramParams>;

const TrainingProgramParamsContext =
  createContext<TrainingProgramParamsType | null>(null);

export const TrainingProgramParamsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const values = useTrainingProgramParams();
  const contextValues = useMemo(() => {
    return values;
  }, [values]);

  return (
    <TrainingProgramParamsContext.Provider value={contextValues}>
      {children}
    </TrainingProgramParamsContext.Provider>
  );
};

export const useTrainingProgramParamsContext = () => {
  const context = useContext(TrainingProgramParamsContext);

  if (!context) {
    throw new Error(
      "useTrainingProgramContext must be used within a TrainingProgramProvider"
    );
  }
  return context;
};

const DEFAULT_MACROCYCLES = 1;
const DEFAULT_TRAINING_BLOCKS = 4;
const DEFAULT_MESOCYCLES = 3;
const DEFAULT_MICROCYCLES = 4;

const useTrainingProgramParams = () => {
  const [macrocycles, setMacroCycles] = useState(DEFAULT_MACROCYCLES);
  const [trainingBlocks, setTrainingBlocks] = useState(DEFAULT_TRAINING_BLOCKS);
  const [mesocycles, setMesocycles] = useState(DEFAULT_MESOCYCLES);
  const [microcycles, setMicrocycles] = useState(DEFAULT_MICROCYCLES);

  const [selectedMesocycle, setSelectedMesocycle] = useState(0);
  const [selectedMicrocycle, setSelectedMicrocycle] = useState(0);

  const onSelectMesocycle = useCallback((selected: number) => {
    setSelectedMesocycle(selected);
  }, []);

  const onSelectMicrocycle = useCallback((selected: number) => {
    setSelectedMicrocycle(selected);
  }, []);

  return {
    macrocycles,
    trainingBlocks,
    mesocycles,
    microcycles,
    selectedMesocycle,
    selectedMicrocycle,
    onSelectMesocycle,
    onSelectMicrocycle,
  };
};

type ToggleCyclesProps = ReturnType<typeof useToggleCycles>;

const ToggleCyclesContext = createContext<ToggleCyclesProps | null>(null);

type ToggleCyclesProviderProps = {
  mesocycles: number;
  microcycles: number;
  children: ReactNode;
};
export const ToggleCyclesProvider = ({
  mesocycles,
  microcycles,
  children,
}: ToggleCyclesProviderProps) => {
  const values = useToggleCycles({ mesocycles, microcycles });
  const contextValues = useMemo(() => {
    return values;
  }, [values]);

  return (
    <ToggleCyclesContext.Provider value={contextValues}>
      {children}
    </ToggleCyclesContext.Provider>
  );
};

export const useToggleCyclesContext = () => {
  const context = useContext(ToggleCyclesContext);

  if (!context) {
    throw new Error(
      "useToggleCyclesContext must be used within a ToggleCyclesProvider"
    );
  }
  return context;
};

type UseToggleCyclesProps = {
  mesocycles: number;
  microcycles: number;
};
const useToggleCycles = ({ mesocycles, microcycles }: UseToggleCyclesProps) => {
  const [selectedMesocycle, setSelectedMesocycle] = useState(mesocycles);
  const [selectedMicrocycle, setSelectedMicrocycle] = useState(microcycles);

  const mesocycle_array = Array.from(
    Array(mesocycles),
    (e, i) => `Mesocycle ${i + 1}`
  );

  const microcycle_array = Array.from(
    Array(microcycles),
    (e, i) => `Microcycle ${i + 1}`
  );

  const onSelectMesocycle = useCallback((selected: number) => {
    setSelectedMesocycle(selected);
  }, []);

  const onSelectMicrocycle = useCallback((selected: number) => {
    setSelectedMicrocycle(selected);
  }, []);
  return {
    mesocycle_array,
    microcycle_array,
    selectedMesocycle,
    selectedMicrocycle,
    onSelectMesocycle,
    onSelectMicrocycle,
  };
};
