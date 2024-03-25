import { BG_COLOR_M7 } from "~/constants/themes";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";

type HeaderScrollNavProps = {
  isSticky: boolean;
};
export default function HeaderScrollNav({ isSticky }: HeaderScrollNavProps) {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  return (
    <div
      className={cn(
        `${BG_COLOR_M7} mb-2 flex h-8 w-full items-center justify-center`,
        { ["fixed left-0 top-[42px] z-20 bg-inherit"]: isSticky }
      )}
    >
      <div className={`${BG_COLOR_M7} h-8 space-x-1 rounded px-4`}>
        {prioritized_muscle_list.map((each) => {
          const muscle = getMuscleTitleForUI(each.muscle);
          return (
            <a href={`#${each.id}`} className={`p-0.5 text-xxs text-white `}>
              {muscle}
            </a>
          );
        })}
      </div>
    </div>
  );
}
