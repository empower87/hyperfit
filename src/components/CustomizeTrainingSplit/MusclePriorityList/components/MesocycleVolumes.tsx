import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getEndOfMesocycleVolume } from "~/utils/musclePriorityHandlers";

type CellProps = {
  muscleGroup: MusclePriorityType;
  mesocycle: number;
};

function Cell({ muscleGroup, mesocycle }: CellProps) {
  const { muscle, mesoProgression, volume_landmark } = muscleGroup;

  const mesoTotalVolume = getEndOfMesocycleVolume(
    muscle,
    mesoProgression[mesocycle - 1],
    volume_landmark
  );
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
