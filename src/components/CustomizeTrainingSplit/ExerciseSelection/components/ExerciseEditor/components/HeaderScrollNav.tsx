import { BG_COLOR_M7 } from "~/constants/themes";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";

export default function HeaderScrollNav() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  return (
    <div
      className={`${BG_COLOR_M7} mb-2 flex h-8 w-full items-center justify-center space-x-1`}
    >
      {prioritized_muscle_list.map((each) => {
        const muscle = getMuscleTitleForUI(each.muscle);
        return (
          <a href={`#${each.id}`} className={`p-0.5 text-xxs text-white `}>
            {muscle}
          </a>
        );
      })}
    </div>
  );
}
