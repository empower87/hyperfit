const AVERAGE_SET_DURATION = 20;
const REST_PERIOD = 60;

export const getEstimatedWorkoutDuration = (totalSets: number) => {
  const setTime = totalSets * AVERAGE_SET_DURATION;
  const restTime = totalSets * REST_PERIOD;

  const totalMinutes = (setTime + restTime) / 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const hoursText = hours === 1 ? `${hours}hr` : hours > 0 ? `${hours}hrs` : "";
  const minutesText = minutes > 0 ? `${minutes}min` : "";

  if (hoursText && minutesText) {
    return `${hoursText} ${minutesText}`;
  } else {
    return hoursText || minutesText;
  }
};
