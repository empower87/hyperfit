import { useEffect, useState } from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getEndOfMesocycleVolume } from "../utils/getVolumeTotal";

type CellProps = {
  muscleGroup: MusclePriorityType;
  mesocycle: number;
};

function Cell({ muscleGroup, mesocycle }: CellProps) {
  const [mesoTotalVolume, setMesoTotalVolume] = useState(0);
  useEffect(() => {
    const { muscle, mesoProgression, volume } = muscleGroup;
    const { landmark, exercisesPerSessionSchema, setProgressionMatrix } =
      volume;
    const mesoTotalVolume = getEndOfMesocycleVolume(
      muscle,
      mesoProgression[mesocycle - 1],
      landmark,
      exercisesPerSessionSchema,
      setProgressionMatrix
    );
    setMesoTotalVolume(mesoTotalVolume);
  }, [muscleGroup, mesocycle]);
  return <div className=" flex w-1/3 justify-center">{mesoTotalVolume}</div>;
}

type MesocycleVolumesProps = {
  muscleGroup: MusclePriorityType;
  width: string;
};

export function MesocycleVolumes({
  muscleGroup,
  width,
}: MesocycleVolumesProps) {
  return (
    <div className={" flex"} style={{ width: width }}>
      <Cell muscleGroup={muscleGroup} mesocycle={1} />
      <Cell muscleGroup={muscleGroup} mesocycle={2} />
      <Cell muscleGroup={muscleGroup} mesocycle={3} />
    </div>
  );
}
