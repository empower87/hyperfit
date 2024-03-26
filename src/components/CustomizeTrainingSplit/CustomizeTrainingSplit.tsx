import { BG_COLOR_M6 } from "~/constants/themes";
import { VOLUME_BG_COLORS } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import {
  TrainingProgramProvider,
  useTrainingProgramContext,
} from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import { CardS, SectionXL as Section } from "../Layout/Sections";
import TrainingBlock from "../Macrocycle/TrainingBlock/TrainingBlock";
import ExerciseOverview from "./ExerciseSelection/ExerciseSelection";
import MuscleEditor from "./ExerciseSelection/components/ExerciseEditor/MuscleEditor";
import {
  Button,
  MiniMusclePriorityList,
} from "./MusclePriorityList/MusclePriorityList";
import ProgramConfig from "./ProgramConfig/ProgramConfig";
import SplitOverview from "./ProgramConfig/SplitOverview";
import { useProgramConfigContext } from "./ProgramConfig/hooks/useProgramConfig";

export default function PageContent() {
  return (
    <div className="m-auto box-border min-h-full max-w-[1200px] px-3 py-10">
      <TrainingProgramProvider>
        <Section title="Customize Training Program">
          <div className="">
            <ProgramConfig>
              {/* <TempMuscleList /> */}
              <MiniMusclePriorityList />
              <div className={`flex flex-col justify-center space-y-1`}>
                <ProgramConfig.Periodization />

                <SplitOverview>
                  <SplitOverview.Split />
                  <SplitOverview.Week />
                </SplitOverview>

                <Buttons />
              </div>
            </ProgramConfig>

            <div className="mb-2 flex flex-col">
              {/* 
                <div className="w-1/4 pr-2">
                  <ListVolumeSettings />
                </div> 
              */}
              <MuscleEditor />
            </div>

            <ExerciseOverview />
          </div>
        </Section>

        <Section title="Training Block Overview">
          <TrainingBlock />
        </Section>
      </TrainingProgramProvider>
    </div>
  );
}

function Cell({
  value,
  className,
}: {
  value: string | number;
  className: string;
}) {
  return (
    <div className={cn(`flex items-center justify-center p-0.5`, className)}>
      {value}
    </div>
  );
}

function TempMuscleList() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const colors = VOLUME_BG_COLORS;
  return (
    <CardS title="PRIORITY">
      <div className={`flex w-60 flex-col space-y-0.5`}>
        {prioritized_muscle_list.map((each, index) => {
          return (
            <div
              className={`flex ${
                colors[each.volume_landmark]
              } rounded-sm text-xxs text-white`}
            >
              <Cell value={index + 1} className="w-5" />
              <Cell
                value={each.muscle}
                className="w-20 justify-start indent-1"
              />
              <Cell value={each.volume.landmark} className="w-10" />
            </div>
          );
        })}
      </div>
    </CardS>
  );
}

function Buttons() {
  const { onSaveConfig } = useProgramConfigContext();

  return (
    <div className={`flex justify-end space-x-1`}>
      <Button
        onClick={() => {}}
        className={`flex rounded text-white ${BG_COLOR_M6}`}
      >
        Reset
      </Button>

      <Button
        onClick={() => onSaveConfig()}
        className={`flex rounded bg-rose-400 px-2 text-white`}
      >
        Save Changes
      </Button>
    </div>
  );
}
