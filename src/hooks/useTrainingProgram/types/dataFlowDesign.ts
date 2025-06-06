type UserT = {
  id: string;
  name: string;
  age: number;
  email: string;
  biometric_data: {
    age: number; // in years
    gender: string;
    height: number; // in in
    weight: number; // in lbs
    body_fat_percentage: number; // in %
    activity_level: string; // e.g., "sedentary", "lightly active", "moderately active", "very active"
  };
  tracking: {
    weight: number;
    body_fat_percentage: number;
    measurements: {
      neck: number;
      chest: number;
      waist: number;
      shoulder: number;
      hips: number;
      arm: number;
      forearm: number;
      thigh: number;
      calf: number;
    };
  };
};

type TrainingProgramT = {
  id: string;
  name: string;
  description: string;
  user_id: UserT["id"];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  macrocycles: number;
  mesocycles: number;
  microcycles: number;
  periodization_map: [];
};

type SetsT = number;
type RepsT = number;
type LlbsT = number; // in lbs
type RirT = number; // Reps in Reserve
type SessionSetT = [SetsT, RepsT, LlbsT, RirT];
type MicrocycleT = SessionSetT[];
type MesocycleT = MicrocycleT[];
type MacrocycleT = MesocycleT[];

type SessionT = {
  id: string;
  training_program_id: TrainingProgramT["id"];
  day: string; // e.g., "Monday"
  split: string; // e.g., "Upper Body", "Lower Body"
  exercises: ExerciseT[];
};

type ExerciseT = {};
