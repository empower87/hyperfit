import { ReactNode } from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";
import { ActionCard, Actions, Exercises } from "./Contents";
import { EditFrequency } from "./EditFrequency";

const TEST_DATA = {
  id: "back-002",
  muscle: "back",
  exercises: [[], [], [], []],
  volume: {
    landmark: "MRV",
    exercisesPerSessionSchema: 2,
  },
  frequency: {
    range: [3, 4],
    target: 0,
    progression: [2, 3, 4],
    setProgressionMatrix: [[], [], []],
  },
};

type MusclePopoutProps = {
  children: ReactNode;
};

MusclePopout.Header = Header;
MusclePopout.Footer = Footer;
MusclePopout.Contents = Contents;
export default function MusclePopout({ children }: MusclePopoutProps) {
  return (
    <div className=" flex w-[1200px] flex-col bg-primary-600">{children}</div>
  );
}

type HeaderProps = {
  children: ReactNode;
};
function Header({ children }: HeaderProps) {
  return (
    <div className="flex justify-between bg-primary-700 p-1">
      <div className="text-m indent-1 font-semibold text-white">
        Edit Muscle
      </div>
      {children}
    </div>
  );
}

type FooterProps = {
  children: ReactNode;
};
function Footer({ children }: FooterProps) {
  return <div className="p-1">{children}</div>;
}

type ContentsPlaceholderProps = {
  children: ReactNode;
};

type ContentsProps = {
  selectedMuscle: MusclePriorityType;
};
export function Contents({ selectedMuscle }: ContentsProps) {
  const {
    selectedMesocycleIndex,
    muscleGroup,
    onSelectMesocycle,
    volumes,
    mesocyclesArray,
    onResetMuscleGroup,
    onSaveMuscleGroupChanges,
    onSelectedFrequencyProgressionIncrement,
    onSelectedFrequencyProgressionDecrement,
  } = useMuscleEditorContext();

  const muscle_name = muscleGroup.muscle;
  const v_landmark = muscleGroup.volume.landmark;
  const frequency_progression = selectedMuscle?.frequency.progression;

  return (
    <div className="flex space-x-1 p-2">
      <ContentsPlaceholder>
        <Actions>
          <div className="flex rounded-lg bg-card">
            <h1>{selectedMuscle?.muscle}</h1>
          </div>
          <ActionCard title="Frequency">
            <EditFrequency frequency_progression={frequency_progression} />
          </ActionCard>
        </Actions>
        <Exercises muscleGroup={selectedMuscle} />
      </ContentsPlaceholder>
    </div>
  );
}

function ContentsPlaceholder({ children }: ContentsPlaceholderProps) {
  return <div className="flex flex-col space-y-2">{children}</div>;
}
