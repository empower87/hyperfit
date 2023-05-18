import { useState } from "react"
const SPLIT = []
const DURATION = 0

type Muscles =
  | "neck"
  | "traps"
  | "delts (mid)"
  | "delts (rear)"
  | "biceps"
  | "triceps"
  | "forearms"
  | "chest"
  | "back"
  | "abs"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves"

type Any = ["neck", "forearms", "abs", "calves"]

type Upper = ["traps", "delts (mid)", "delts (rear)", "biceps", "triceps", "chest", "back"]
type Lower = ["glutes", "quads", "hamstrings"]

type Push = ["traps", "delts (mid)", "delts (rear)", "triceps", "chest"] // ideally I want rear delts in here too
type Pull = ["traps", "delts (mid)", "delts (rear)", "biceps", "back"]
type Legs = ["glutes", "quads", "hamstrings"]

type Chest = ["chest", "triceps", "delts (mid)", "traps"]
type Shoulders = ["traps", "delts (mid)", "delts (rear)"]
type Arms = ["triceps", "biceps"]
type Back = ["back", "biceps", "delts (rear)", "traps"]

type SplitType = "upper" | "lower" | "push" | "pull" | "legs" | "chest" | "arms" | "shoulders" | "back"

const WORKOUT_SPLIT = [
  {
    day: 1,
    split: "upper",
  },
  {
    day: 3,
    split: "lower",
  },
  {
    day: 5,
    split: "push",
  },
  {
    day: 6,
    split: "legs",
  },
  {
    day: 7,
    split: "pull",
  },
]

const TRAINING_VOLUME = ["maximum recoverable volume", "minimum effective volume", "maintenance", "none"]

type GetWorkoutVolumeProps = {
  props: {
    muscle: Muscles
    numOfWorkouts: number
  }
}

const getWorkoutVolume = (props: GetWorkoutVolumeProps) => {
  const [lol, setLol] = useState()

  return null
}

const PRIORITY_LIST = [
  ["neck", 25],
  ["traps", 25],
  ["delts (mid)", 25],
  ["delts (rear)", 25],
  ["biceps", 25],
  ["triceps", 25],
  ["forearms", 25],
  ["chest", 25],
  ["back", 25],
  ["abs", 25],
  ["glutes", 25],
  ["quads", 25],
  ["hamstrings", 25],
  ["calves", 25],
]

const workoutApp = () => {}

// prompt for number of workouts in a week

// prompt how many of these workouts are upper and lower

// prompt for priority muscle groups
