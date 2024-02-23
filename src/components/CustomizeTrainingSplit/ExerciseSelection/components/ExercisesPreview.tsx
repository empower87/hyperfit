import { ReactNode, useCallback, useState } from "react";
// import FilterIcon from "src/assets/icons/filter-svg.svg";
import { FilterIcon, SearchIcon } from "~/assets/icons/_icons";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BG_COLOR_M8,
  BORDER_COLOR_M5,
} from "~/constants/themes";
import { useOutsideClick } from "~/hooks/useOnOutsideClick";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { getGroupList } from "~/utils/getExercises";
import { Button } from "../../MusclePriorityList/MusclePriorityList";
import { EditMuscleModal } from "../../MusclePriorityList/components/EditMuscleModal";

type ExercisesPreviewProps = {
  musclePriorityList: MusclePriorityType[];
};
export default function ExercisesPreview({
  musclePriorityList,
}: ExercisesPreviewProps) {
  const [selectedMuscleIndex, setSelectedMuscleIndex] = useState<number>(0);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);
  // const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>(
  //   []
  // );
  const selectedExercises =
    musclePriorityList[selectedMuscleIndex].exercises.flat();

  // useEffect(() => {
  //   setSelectedExercises(
  //     musclePriorityList[selectedExerciseIndex].exercises.flat()
  //   );
  // }, [musclePriorityList, selectedExerciseIndex]);

  // const selectedExercises =
  //   musclePriorityList[selectedExerciseIndex].exercises.flat();

  const onSelectHandler = (type: "muscle" | "exercise", index: number) => {
    if (type === "muscle") {
      setSelectedMuscleIndex(index);
      setSelectedExerciseIndex(0);
    } else {
      setSelectedExerciseIndex(index);
      setIsOpen(true);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn(`mr-2 flex w-44 flex-col`)}>
      {isOpen ? (
        <EditMuscleModal isOpen={isOpen} onClose={onClose}>
          <SelectExercise>
            <SelectExercise.Header>
              <SelectExercise.Search />
              <SelectExercise.Filter />
            </SelectExercise.Header>

            <SelectExercise.List
              muscle={musclePriorityList[selectedMuscleIndex].muscle}
              exercise={selectedExercises[selectedExerciseIndex]?.exercise}
            />
          </SelectExercise>
        </EditMuscleModal>
      ) : null}

      <div className={cn(`mb-2 flex space-x-1 overflow-x-auto border-b-2`)}>
        {musclePriorityList.map((each, index) => {
          return (
            <Item
              key={`${each}_${index}`}
              value={each.muscle}
              selected={musclePriorityList[selectedMuscleIndex].muscle}
              onClick={() => onSelectHandler("muscle", index)}
            />
          );
        })}
      </div>
      <div className={cn(`space-y-1 overflow-y-auto`)}>
        {selectedExercises.map((each, index) => {
          return (
            <Item
              key={`${each.id}`}
              value={each.exercise}
              selected={selectedExercises[selectedExerciseIndex]?.exercise}
              onClick={() => onSelectHandler("exercise", index)}
              className="text-xxs"
            />
          );
        })}
      </div>
    </div>
  );
}

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  selected: string;
}
function Item({ value, selected, className, ...props }: ItemProps) {
  const selectedClasses = `font-bold text-white ${BG_COLOR_M5}`;
  return (
    <div
      {...props}
      className={cn(
        `flex p-1 indent-1 text-xs text-slate-400 ${BG_COLOR_M6} cursor-pointer hover:${BG_COLOR_M5}`,
        {
          [selectedClasses]: value === selected,
        },
        className
      )}
    >
      {value}
    </div>
  );
}

function Header({ children }: { children: ReactNode }) {
  return <div className={"flex justify-between"}>{children}</div>;
}
function Search({}) {
  return (
    <div className={cn(`m-1 flex w-1/2 indent-1 text-white ${BG_COLOR_M8}`)}>
      <div className="mx-1 flex items-center justify-center">
        <SearchIcon className="fill:white text-sm" />
      </div>
      <div className="">Search</div>
    </div>
  );
}

function CategoryItem({
  title,
  onClick,
}: {
  title: string;
  onClick: (title: string) => void;
}) {
  return (
    <div
      className={cn(
        `flex cursor-pointer items-center justify-center border p-1 text-xs text-white`
      )}
      onClick={() => onClick(title)}
    >
      {title}
    </div>
  );
}

type CategoryProps = {
  title: string;
  children: ReactNode;
};
function Category({ title, children }: CategoryProps) {
  return (
    <div className={cn(`mb-2 flex flex-col`)}>
      <div
        className={cn(`flex ${BG_COLOR_M6} mb-2 indent-1 text-xs text-white`)}
      >
        {title}
      </div>
      <div className={cn(`flex space-x-1`)}>{children}</div>
    </div>
  );
}

type FilterMenuProps = {
  onSelectTag: (title: string) => void;
};
function FilterMenu({ onSelectTag }: FilterMenuProps) {
  return (
    <div
      className={cn(
        `absolute right-0 flex flex-col space-y-1 p-2 ${BG_COLOR_M7} border ${BORDER_COLOR_M5}`
      )}
    >
      <Category title="Equipment">
        <CategoryItem onClick={onSelectTag} title="Dumbbell" />
        <CategoryItem onClick={onSelectTag} title="Barbell" />
        <CategoryItem onClick={onSelectTag} title="Machine" />
      </Category>

      <Category title="Sub-Group Focus">
        <CategoryItem onClick={onSelectTag} title="Lat" />
        <CategoryItem onClick={onSelectTag} title="Upper Back" />
        <CategoryItem onClick={onSelectTag} title="Upper Traps" />
      </Category>

      <Category title="">
        <CategoryItem onClick={onSelectTag} title="Lat" />
        <CategoryItem onClick={onSelectTag} title="Upper Back" />
        <CategoryItem onClick={onSelectTag} title="Upper Traps" />
      </Category>
    </div>
  );
}

type FilterTagProps = {
  tag: string;
  onRemoveTag: (tag: string) => void;
};
function FilterTag({ tag, onRemoveTag }: FilterTagProps) {
  return (
    <div
      className={cn(
        `m-0.5 flex h-5 items-center justify-center p-1 text-white ${BORDER_COLOR_M5} ${BG_COLOR_M6}`
      )}
    >
      <div className="p-0.5">{tag}</div>
      <button
        className={cn(`flex items-center justify-center p-0.5`)}
        onClick={() => onRemoveTag(tag)}
      >
        x
      </button>
    </div>
  );
}

type FilterProps = {
  tags: string[];
};
function Filter({}) {
  const [showMenu, setShowMenu] = useState(false);
  const onClick = () => setShowMenu(true);
  const onClose = () => setShowMenu(false);
  const ref = useOutsideClick(onClose);
  const [tags, setTags] = useState<string[]>([]);

  const onSelectTagHandler = useCallback(
    (title: string) => {
      const findTag = tags.find((each) => each === title);
      if (findTag) return;

      setTags(() => [...tags, title]);
    },
    [tags]
  );

  const onRemoveTag = useCallback(
    (tag: string) => {
      const filterTags = tags.filter((each) => each !== tag);
      setTags(filterTags);
    },
    [tags]
  );

  return (
    <div ref={ref} className={cn(`relative flex w-1/2`)}>
      <div className={`flex w-11/12 flex-wrap text-xxs`}>
        {tags.map((each) => {
          return <FilterTag tag={each} onRemoveTag={onRemoveTag} />;
        })}
      </div>
      <div className={`w-1/12`}>
        <Button onClick={onClick} className="">
          <FilterIcon className="fill-white text-sm" />
        </Button>
      </div>

      {showMenu ? <FilterMenu onSelectTag={onSelectTagHandler} /> : null}
    </div>
  );
}

type ListProps = {
  muscle: string;
  exercise: string;
};
function List({ muscle, exercise }: ListProps) {
  const exercises = getGroupList(muscle);
  return (
    <div className={cn(`flex flex-col`)}>
      <div className={cn(`mb-2 flex border-b-2 indent-1 text-xs text-white`)}>
        Exercises
      </div>

      <div className={cn(`flex h-60 flex-col overflow-y-auto`)}>
        {exercises.map((each) => {
          return <Item value={each.name} selected={exercise} />;
        })}
      </div>
    </div>
  );
}

type SelectExerciseProps = {
  children: ReactNode;
};
function SelectExercise({ children }: SelectExerciseProps) {
  return (
    <div className={cn(`flex flex-col ${BG_COLOR_M7} w-3/4`)}>
      <div className={cn(`flex justify-between ${BG_COLOR_M6} mb-2`)}>
        <div className={cn(`indent-1 text-sm text-white`)}>Select Exercise</div>
        <button
          className={cn(
            `mr-1 flex h-5 w-5 items-center justify-center text-white hover:${BG_COLOR_M5}`
          )}
        >
          x
        </button>
      </div>
      {children}
    </div>
  );
}

SelectExercise.List = List;
SelectExercise.Header = Header;
SelectExercise.Search = Search;
SelectExercise.Filter = Filter;
