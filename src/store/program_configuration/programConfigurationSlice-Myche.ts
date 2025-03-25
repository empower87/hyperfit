import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ConfigurationSettingsType = {
  frequency: {
    total: number;
    training_days: number;
    max_sessions_per_day: number;
  };
  split: {
    split: string;
  };
  muscles: {
    prioritized: string[];
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
const PRIORITIZED_MUSCLE = {
  name: "abs",
  frequency: {
    range: [0, 1],
    target: 1,
  },
};
const CONFIGURATION_SETTINGS: ConfigurationSettingsType = {
  frequency: {
    total: 5,
    training_days: 5,
    max_sessions_per_day: 1,
  },
  split: {
    split: "OPT",
  },
  muscles: {
    prioritized: [
      "abs",
      "back",
      "biceps",
      "calves",
      "chest",
      "delts_front",
      "delts_rear",
      "delts_side",
      "forearms",
      "glutes",
      "hamstrings",
      "quads",
      "traps",
      "triceps",
    ],
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
