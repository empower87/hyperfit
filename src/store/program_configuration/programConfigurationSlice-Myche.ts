import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const MUSCLE_PRIORITY_LIST: PrioritizedMuscleType[] = [
  {
    name: "back",
    volume_landmark: "MRV",
    frequency_range: [3, 4],
    frequency_target: 0,
  },
  {
    name: "delts_side",
    volume_landmark: "MRV",
    frequency_range: [3, 6],
    frequency_target: 0,
  },
  {
    name: "triceps",
    volume_landmark: "MRV",
    frequency_range: [2, 4],
    frequency_target: 0,
  },
  {
    name: "hamstrings",
    volume_landmark: "MRV",
    frequency_range: [2, 3],
    frequency_target: 0,
  },
  {
    name: "quads",
    volume_landmark: "MEV",
    frequency_range: [2, 5],
    frequency_target: 0,
  },
  {
    name: "delts_rear",
    volume_landmark: "MEV",
    frequency_range: [3, 6],
    frequency_target: 0,
  },
  {
    name: "forearms",
    volume_landmark: "MEV",
    frequency_range: [3, 6],
    frequency_target: 0,
  },
  {
    name: "traps",
    volume_landmark: "MEV",
    frequency_range: [2, 4],
    frequency_target: 0,
  },
  {
    name: "biceps",
    volume_landmark: "MEV",
    frequency_range: [3, 6],
    frequency_target: 0,
  },
  {
    name: "chest",
    volume_landmark: "MV",
    frequency_range: [2, 4],
    frequency_target: 0,
  },
  {
    name: "calves",
    volume_landmark: "MV",
    frequency_range: [3, 6],
    frequency_target: 0,
  },
  {
    name: "delts_front",
    volume_landmark: "MV",
    frequency_range: [2, 3],
    frequency_target: 0,
  },
  {
    name: "abs",
    volume_landmark: "MV",
    frequency_range: [3, 6],
    frequency_target: 0,
  },
  {
    name: "glutes",
    volume_landmark: "MV",
    frequency_range: [2, 5],
    frequency_target: 0,
  },
];

type PrioritizedMuscleType = {
  name: string;
  volume_landmark: string;
  frequency_range: [number, number];
  frequency_target: number;
};

type ConfigurationSettingsType = {
  frequency: {
    total: number;
    training_days: number;
    max_sessions_per_day: number;
  };
  split: {
    name: string;
    sessions: string[];
  };
  muscles: {
    prioritized: PrioritizedMuscleType[];
    mrv_breakpoint: number;
    mev_breakpoint: number;
  };
  training_program_settings: {
    macrocycles: number;
    training_blocks: number;
    mesocycles: number;
    microcycles: number;
  };
};

const CONFIGURATION_SETTINGS: ConfigurationSettingsType = {
  frequency: {
    total: 5,
    training_days: 5,
    max_sessions_per_day: 1,
  },
  split: {
    name: "OPT",
    sessions: [],
  },
  muscles: {
    prioritized: [...MUSCLE_PRIORITY_LIST],
    mrv_breakpoint: 4,
    mev_breakpoint: 9,
  },
  training_program_settings: {
    macrocycles: 1,
    training_blocks: 4,
    mesocycles: 3,
    microcycles: 4,
  },
};

// ugh
const CONFIG_LAYER_TWO = {
  sessions: ["lower", "upper", "full"],
  muscles_list: [
    {
      name: "abs",
      frequency: {
        range: [0, 1],
        target: 1,
      },
    },
  ],
};

type NestedKey<O extends Record<string, unknown>> = {
  [K in Extract<keyof O, string>]: O[K] extends Array<any>
    ? K
    : O[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${NestedKey<O[K]>}`
    : K;
}[Extract<keyof O, string>];

type UpdateSettingsAction = {
  key: NestedKey<ConfigurationSettingsType>;
  value: string | number | string[];
};
const programConfigurationSlice = createSlice({
  name: "program_configuration",
  initialState: CONFIGURATION_SETTINGS,
  reducers: {
    updateSettings: (state, action: PayloadAction<UpdateSettingsAction>) => {
      const keys = action.payload.key;
      const newValue = action.payload.value;
      const splitKeys = keys.split(".");

      if (splitKeys.length > 1) {
        const rootKey = splitKeys[0] as keyof ConfigurationSettingsType;
        const nestedKey =
          splitKeys[1] as keyof ConfigurationSettingsType[typeof rootKey];
        return {
          ...state,
          [rootKey]: {
            ...state[rootKey],
            [nestedKey]: newValue,
          },
        };
      } else {
        const rootKey = keys as keyof ConfigurationSettingsType;
        return {
          ...state,
          [rootKey]: newValue,
        };
      }
    },
  },
});

export const {} = programConfigurationSlice.actions;
export default programConfigurationSlice.reducer;
