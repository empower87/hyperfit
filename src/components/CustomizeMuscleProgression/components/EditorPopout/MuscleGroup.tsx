import { ReactNode } from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
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

  const muscle_name = selectedMuscle?.muscle;
  const presentational_muscle_name =
    muscle_name.charAt(0).toUpperCase() + muscle_name.slice(1);
  const v_landmark = selectedMuscle?.volume.landmark;
  const frequency_progression = selectedMuscle?.frequency.progression;

  const muscle_rank_color = getRankColor(v_landmark);
  return (
    <div className="flex space-x-1 p-2 border-input ">
      <ContentsPlaceholder>

        <Actions>
          <div className={cn(`flex rounded-md p-2 ${muscle_rank_color.bg}`)}>
            <h1>{presentational_muscle_name}</h1>
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

type ContentsPlaceholderProps = {
  children: ReactNode;
};
function ContentsPlaceholder({ children }: ContentsPlaceholderProps) {
  return <div className="flex flex-col space-y-2">{children}</div>;
}
