import { useState } from "react";
import { MusclePriorityType } from "~/pages";

const MIN_DAYS = 3;
const MIN_DOUBLE_DAYS = 0;
const MAX_FREQUENCY = 4;

export default function useWeeklySessionSplit(list: MusclePriorityType[]) {
  const [days, setDays] = useState<number>(MIN_DAYS);
  const [doubleDays, setDoubleDays] = useState<number>(MIN_DOUBLE_DAYS);
}
