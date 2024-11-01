import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";
import { Actions, Exercises } from "./Contents";
import Counter from "./Counter";

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
    <div className="flex space-x-1">
      <ContentsPlaceholder>
        <Actions>
          <div className={cn(`flex w-24 items-start rounded-md`)}>
            <h2
              className={`w-full rounded-sm px-2 py-1 font-semibold leading-none tracking-tight ${muscle_rank_color.bg}`}
            >
              {presentational_muscle_name}
            </h2>
          </div>
          <ToggleMesocycle />

          {/* <ActionCard title="Frequency">
            <EditFrequency frequency_progression={frequency_progression} />
          </ActionCard> */}
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
  return <div className="flex flex-col space-y-3">{children}</div>;
}

export function ToggleMesocycle() {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-x-3 gap-y-1">
      <div className="">Mesocycle</div>
      <div className="flex items-center justify-center">1</div>
      <div className="flex items-center justify-center">2</div>
      <div className="flex items-center justify-center">3</div>

      <div className="mt-1 text-sm text-muted-foreground">Frequency</div>
      <div className="mt-1">
        <Counter
          minus={
            <Button variant="outline" size="icon">
              <MinusIcon fill="white" />
            </Button>
          }
          input={<Input placeholder={"3"} />}
          plus={
            <Button variant="outline" size="icon">
              <PlusIcon fill="white" />
            </Button>
          }
        />
      </div>
      <div className="mt-1">
        <Counter
          minus={
            <Button variant="outline" size="icon">
              <MinusIcon fill="white" />
            </Button>
          }
          input={<Input placeholder={"4"} />}
          plus={
            <Button variant="outline" size="icon">
              <PlusIcon fill="white" />
            </Button>
          }
        />
      </div>
      <div className="mt-1">
        <Counter
          minus={
            <Button variant="outline" size="icon">
              <MinusIcon fill="white" />
            </Button>
          }
          input={<Input placeholder={"5"} />}
          plus={
            <Button variant="outline" size="icon">
              <PlusIcon fill="white" />
            </Button>
          }
        />
      </div>

      <div className="text-sm text-muted-foreground">Volume</div>
      <div className="flex items-center justify-center">20</div>
      <div className="flex items-center justify-center">22</div>
      <div className="flex items-center justify-center">24</div>
    </div>
  );
}
