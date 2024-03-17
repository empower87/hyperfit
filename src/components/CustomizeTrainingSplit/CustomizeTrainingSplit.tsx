import { VOLUME_BG_COLORS } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import {
  TrainingProgramProvider,
  useTrainingProgramContext,
} from "~/hooks/useTrainingProgram/useTrainingProgram";
import { SectionXL as Section } from "../Layout/Sections";
import TrainingBlock from "../Macrocycle/TrainingBlock/TrainingBlock";
import ExerciseOverview from "./ExerciseSelection/ExerciseSelection";
import { MusclePriorityList } from "./MusclePriorityList/MusclePriorityList";
import ProgramConfig from "./ProgramConfig/ProgramConfig";
import SplitOverview from "./ProgramConfig/SplitOverview";

export default function PageContent() {
  return (
    <div className="m-auto flex h-full max-w-[1200px] flex-col overflow-y-scroll pt-5">
      <TrainingProgramProvider>
        <Section title="Customize Training Program">
          <div className="">
            <ProgramConfig>
              {/* <ProgramConfig.Periodization /> */}
              <TempMuscleList />
              <div className={`flex justify-center`}>
                <SplitOverview>
                  <SplitOverview.Split />
                  <SplitOverview.Week />
                </SplitOverview>
              </div>
            </ProgramConfig>

            <div className="mb-2 flex flex-col">
              {/* 
                <div className="w-1/4 pr-2">
                  <ListVolumeSettings />
                </div> 
              */}

              <MusclePriorityList />
            </div>

            <ExerciseOverview>
              <ExerciseOverview.ExercisePreview />
            </ExerciseOverview>
          </div>
        </Section>

        <Section title="Training Block Overview">
          <TrainingBlock />
        </Section>
      </TrainingProgramProvider>
    </div>
  );
}

function TempMuscleList() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const colors = VOLUME_BG_COLORS;
  return (
    <div className={`flex flex-col space-y-1`}>
      {prioritized_muscle_list.map((each, index) => {
        return (
          <div
            className={`flex ${
              colors[each.volume_landmark]
            } p-0.5 text-xs text-white`}
          >
            {index + 1} - {each.muscle}
          </div>
        );
      })}
    </div>
  );
}
