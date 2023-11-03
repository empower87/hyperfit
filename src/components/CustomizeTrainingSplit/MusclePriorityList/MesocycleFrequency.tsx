import { useEffect, useState } from "react";
import { BG_COLOR_M6 } from "~/utils/themes";

export type State = {
  min_max_values: [[number, number], [number, number], [number, number]];
  values: [number, number, number];
  total: number;
};

type Action = {
  type: "ADD" | "SUB" | "INITIALIZE";
  payload?: {
    mesocycle?: number;
    mesoProgression?: number[];
    total: [number, number];
  };
};

export const INITIAL_STATE: State = {
  min_max_values: [
    [0, 2],
    [1, 3],
    [2, 4],
  ],
  values: [1, 2, 3],
  total: 4,
};

export default function mesocycleFrequencyReducer(
  state: State,
  action: Action
) {
  switch (action.type) {
    case "ADD":
      if (!action.payload || !action.payload.mesocycle) return state;
      const meso = action.payload.mesocycle;
      const key = meso - 1;
      const min_max_value = state.min_max_values[key];
      const value = state.values[key];
      const newValue = value + 1;

      return state;
    case "SUB":
      if (!action.payload || !action.payload.mesocycle) return state;
      const meso2 = action.payload.mesocycle;
      const getMinMaxKey2 =
        meso2 === 1
          ? "meso_one_min_max"
          : meso2 === 2
          ? "meso_two_min_max"
          : "meso_three_min_max";
      // const minMax2 = state[getMinMaxKey2]

      return state;
    case "INITIALIZE":
      if (
        !action.payload ||
        !action.payload.mesoProgression ||
        !action.payload.total
      )
        return state;
      const mesoProgression = action.payload.mesoProgression;
      const total = action.payload.total[0] + action.payload.total[1];

      const one = mesoProgression[0];
      const two = mesoProgression[1];
      const three = mesoProgression[2];

      const one_min_max = [0, two];
      const two_min_max = [one, three];
      const three_min_max = [two, total];

      return {
        min_max_values: [one_min_max, two_min_max, three_min_max],
        values: [one, two, three],
        total: total,
      };
    default:
      return state;
  }
}

type CellWithCounterProps = {
  mesocycle: number;
  mesoProgression: number[];
  total_sessions: [number, number];
};

function CellWithCounter({
  mesocycle,
  mesoProgression,
  total_sessions,
}: CellWithCounterProps) {
  const [canAdd, setCanAdd] = useState<boolean>(true);
  const [canSub, setCanSub] = useState<boolean>(true);
  const frequency =
    mesocycle === 1
      ? mesoProgression[0]
      : mesocycle === 2
      ? mesoProgression[1]
      : mesoProgression[2];
  const [currentValue, setCurrentValue] = useState<number>(frequency);

  const totalSessions = total_sessions[0] + total_sessions[1];
  const [minMax, setMinMax] = useState<[number, number]>([0, totalSessions]);

  useEffect(() => {
    setCurrentValue(frequency);
  }, [frequency]);

  useEffect(() => {
    const maxFrequency =
      mesocycle === 3
        ? totalSessions
        : mesocycle === 2
        ? mesoProgression[2]
        : mesoProgression[1];
    const minFrequency =
      mesocycle === 3
        ? mesoProgression[2]
        : mesocycle === 2
        ? mesoProgression[0]
        : 0;
    setMinMax([minFrequency, maxFrequency]);
  }, [totalSessions, mesocycle, mesoProgression]);

  useEffect(() => {
    if (currentValue > minMax[0]) {
      setCanSub(true);
    } else {
      setCanSub(false);
    }

    if (currentValue < minMax[1]) {
      setCanAdd(true);
    } else {
      setCanAdd(false);
    }
  }, [currentValue, minMax]);

  const onClickHandler = (type: "add" | "sub") => {
    if (type === "add") {
      setCurrentValue((prev) => prev + 1);
    } else {
      setCurrentValue((prev) => prev - 1);
    }
  };

  return (
    <div className=" flex w-1/3 justify-center">
      {canSub && (
        <button
          className={BG_COLOR_M6 + " p-1 text-xs font-bold"}
          onClick={() => onClickHandler("sub")}
        >
          -
        </button>
      )}

      <div className={" text-xxs p-1"}>{currentValue}</div>
      {canAdd && (
        <button
          className={BG_COLOR_M6 + " p-1 text-xs font-bold"}
          onClick={() => onClickHandler("add")}
        >
          +
        </button>
      )}
    </div>
  );
}
