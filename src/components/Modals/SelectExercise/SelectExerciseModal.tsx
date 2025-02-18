import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactNode, useCallback, useState } from "react";
import { FilterIcon, SearchIcon } from "~/assets/icons/_icons";
import { Button } from "~/components/ui/button";
import { useOutsideClick } from "~/hooks/useOnOutsideClick";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { JSONExercise } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { cn } from "~/lib/clsx";
import {
  FilterTagsKey,
  SelectExerciseProvider,
  useSelectExerciseContext,
} from "./SelectExerciseContext";

function Header({ children }: { children: ReactNode }) {
  return <div className={"flex justify-between"}>{children}</div>;
}
function Search() {
  return (
    <div className={cn(`flex w-1/2 bg-primary-800 p-2 indent-1 text-white`)}>
      <div className="mx-1 flex items-center justify-center">
        <SearchIcon className="fill:white text-sm" />
      </div>
      <div className="">Search</div>
    </div>
  );
}

interface CategoryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}
function CategoryItem({ title, ...props }: CategoryItemProps) {
  return (
    <div
      {...props}
      className={cn(
        `flex cursor-pointer items-center justify-center border p-1 text-xs text-white`
      )}
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
        className={cn(`mb-2 flex bg-primary-600 indent-1 text-xs text-white`)}
      >
        {title}
      </div>
      <div className={cn(`flex space-x-1`)}>{children}</div>
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
        `flex items-center justify-center space-x-1 rounded-md border-primary-500 bg-primary-600 px-2 text-white`
      )}
    >
      <p className="text-sm">{tag}</p>
      <Button variant="ghost" size="icon" onClick={() => onRemoveTag(tag)}>
        <Cross2Icon fill="white" />
      </Button>
    </div>
  );
}

type FilterMenuProps = {
  onSelectTag: (key: FilterTagsKey, value: string | null) => void;
};
function FilterMenu({ onSelectTag }: FilterMenuProps) {
  return (
    <div
      className={cn(
        `absolute right-0 flex flex-col space-y-1 border border-primary-500 bg-primary-700 p-2`
      )}
    >
      <div className={cn(`mb-2 border-b-2 text-sm text-white`)}>Filters</div>

      <Category title="Equipment">
        <CategoryItem
          onClick={() => onSelectTag("equipment", "dumbbell")}
          title="Dumbbell"
        />
        <CategoryItem
          onClick={() => onSelectTag("equipment", "barbell")}
          title="Barbell"
        />
        <CategoryItem
          onClick={() => onSelectTag("equipment", "machine")}
          title="Machine"
        />
      </Category>

      <Category title="Sub-Group Focus">
        <CategoryItem
          onClick={() => onSelectTag("region", "lats")}
          title="Lats"
        />
        <CategoryItem
          onClick={() => onSelectTag("region", "upper-back")}
          title="Upper Back"
        />
      </Category>

      <Category title="Movement Type">
        <CategoryItem
          onClick={() => onSelectTag("movement_type", "compound")}
          title="Compound"
        />
        <CategoryItem
          onClick={() => onSelectTag("movement_type", "isolation")}
          title="Isolation"
        />
      </Category>
    </div>
  );
}

function Filter() {
  const { filterTags, onFilterTagChange } = useSelectExerciseContext();
  const [showMenu, setShowMenu] = useState(false);
  const onClick = () => setShowMenu(true);
  const onClose = () => setShowMenu(false);

  const ref = useOutsideClick(onClose);

  const onRemoveTag = useCallback(
    (tag: string) => {
      const tagKey = Object.keys(filterTags).find(
        (key) => filterTags[key as FilterTagsKey] === tag
      );
      if (tagKey) {
        onFilterTagChange(tagKey as FilterTagsKey, null);
      }
    },
    [filterTags]
  );

  return (
    <div ref={ref} className={cn(`relative flex w-1/2`)}>
      <div className={`flex w-11/12 flex-wrap`}>
        {Object.values(filterTags).map((each) => {
          if (each == null) return null;
          return (
            <FilterTag
              key={`${each}_tag`}
              tag={each}
              onRemoveTag={onRemoveTag}
            />
          );
        })}
      </div>

      <div className={`w-1/12`}>
        <button onClick={onClick} className="">
          <FilterIcon className="fill-white text-sm" />
        </button>
      </div>

      {showMenu ? <FilterMenu onSelectTag={onFilterTagChange} /> : null}
    </div>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return <div className={cn(`flex w-[900px] flex-col`)}>{children}</div>;
}

type ItemTagProps = {
  name: string;
  selected: string;
};
function ItemTag({ name, selected }: ItemTagProps) {
  return (
    <div
      className={cn(
        `flex rounded-md border p-1 px-2 text-xs text-muted-foreground`
      )}
    >
      {name}
    </div>
  );
}
interface ItemProps extends React.HTMLAttributes<HTMLLIElement> {
  exercise: JSONExercise;
  selected: boolean;
}
function Item({ exercise, selected, ...props }: ItemProps) {
  const { selectedExerciseId, exerciseId } = useSelectExerciseContext();

  return (
    <li
      {...props}
      className={cn(
        `flex cursor-pointer rounded-md bg-card indent-1 text-xs text-muted-foreground hover:bg-primary-500/50`,
        {
          [`bg-primary-500 hover:bg-primary-500`]:
            exerciseId === exercise.id || exercise.id === selectedExerciseId,
        }
      )}
    >
      <div className={"flex w-4/12 flex-col"}>
        <div className={`mr-2 flex p-2`}>
          <div className="text-white">{exercise.name}</div>
          {selected ? (
            <div className={`text-xxs font-bold text-white `}>Selected</div>
          ) : null}
        </div>
        <div className={`flex space-x-1 p-2 pt-0`}>
          <ItemTag name={exercise.movement_type} selected={""} />
          {exercise.limbs_involved ? (
            <ItemTag name={exercise.limbs_involved} selected={""} />
          ) : null}
        </div>
      </div>

      <div className={"w-1/12"}>{exercise.rank}</div>
      <div className={"w-1/12"}>
        {exercise.hypertrophy_criteria?.stretch.lengthened}
      </div>
      <div className={"w-1/12"}>
        {exercise.hypertrophy_criteria?.stretch.challenging}
      </div>
      <div className={"w-1/12"}>
        {exercise.hypertrophy_criteria?.limiting_factor}
      </div>
      <div className={"w-1/12"}>
        {exercise.hypertrophy_criteria?.loadability}
      </div>
      <div className={"w-1/12"}>{exercise.hypertrophy_criteria?.stability}</div>
      <div className={"w-1/12"}>
        {exercise.hypertrophy_criteria?.target_function}
      </div>
      <div className={"w-1/12"}>
        {exercise.hypertrophy_criteria?.time_efficiency}
      </div>
    </li>
  );
}

function List({ children }: { children: ReactNode }) {
  const { onSortHandler } = useSelectExerciseContext();
  const [sortedByIndicator, setSortedByIndicator] = useState<string | null>(
    null
  );
  const onClickHandler = (
    key: string,
    secondKey?: "lengthened" | "challenging"
  ) => {
    onSortHandler(key, secondKey);
    setSortedByIndicator(secondKey ? secondKey : key);
  };
  return (
    <div className={cn(`flex flex-col`)}>
      <div
        className={cn(`mb-2 flex border-b py-2 indent-1 text-xs text-white`)}
      >
        <div className={`w-4/12`}>Exercise</div>
        <div
          onClick={() => onClickHandler("rank")}
          className={cn(`w-1/12 cursor-pointer hover:bg-primary-600`, {
            [`bg-primary-500`]: sortedByIndicator === "rank",
          })}
        >
          Ranked
        </div>
        <div
          onClick={() => onClickHandler("stretch", "lengthened")}
          className={cn(`w-1/12 cursor-pointer hover:bg-primary-600`, {
            [`bg-primary-500`]: sortedByIndicator === "lengthened",
          })}
        >
          Length
        </div>
        <div
          onClick={() => onClickHandler("stretch", "challenging")}
          className={cn(`w-1/12 cursor-pointer hover:bg-primary-600`, {
            [`bg-primary-500`]: sortedByIndicator === "challenging",
          })}
        >
          Chall.
        </div>
        <div
          onClick={() => onClickHandler("limiting_factor")}
          className={cn(`w-1/12 cursor-pointer hover:bg-primary-600`, {
            [`bg-primary-500`]: sortedByIndicator === "limiting_factor",
          })}
        >
          Limit
        </div>
        <div
          onClick={() => onClickHandler("loadability")}
          className={cn(`w-1/12 cursor-pointer hover:bg-primary-600`, {
            [`bg-primary-500`]: sortedByIndicator === "loadability",
          })}
        >
          Load
        </div>
        <div
          onClick={() => onClickHandler("stability")}
          className={cn(`w-1/12 cursor-pointer hover:bg-primary-600`, {
            [`bg-primary-500`]: sortedByIndicator === "stability",
          })}
        >
          Stable
        </div>
        <div
          onClick={() => onClickHandler("target_function")}
          className={cn(`w-1/12 cursor-pointer hover:bg-primary-600`, {
            [`bg-primary-500`]: sortedByIndicator === "target_function",
          })}
        >
          Target
        </div>
        <div
          onClick={() => onClickHandler("time_efficiency")}
          className={cn(`w-1/12 cursor-pointer hover:bg-primary-600`, {
            [`bg-primary-500`]: sortedByIndicator === "time_efficiency",
          })}
        >
          Time
        </div>
      </div>

      <ul
        className={cn(`flex h-72 flex-col space-y-2 overflow-y-auto py-3 pr-3`)}
      >
        {children}
      </ul>
    </div>
  );
}

SelectExercise.List = List;
SelectExercise.Layout = Layout;
SelectExercise.Item = Item;
SelectExercise.Header = Header;
SelectExercise.Search = Search;
SelectExercise.Filter = Filter;

function SelectExerciseContents({
  onSelect,
}: {
  onSelect: (exercise: JSONExercise) => void;
}) {
  const {
    exercises,
    allExercises,
    alphabetizedExercises,
    groupedExercises,
    selectedExerciseId,
    onSelectExerciseHandler,
    onSaveExerciseHandler,
  } = useSelectExerciseContext();

  const onSelectHandler = (id: JSONExercise["id"]) => {
    onSelectExerciseHandler(id);
    const new_exercise = exercises.find((each) => each.id === id);
    if (!new_exercise) return;
    onSelect(new_exercise);
  };

  return (
    <SelectExercise.Layout>
      <SelectExercise.Header>
        <SelectExercise.Search />
        <SelectExercise.Filter />
      </SelectExercise.Header>

      <SelectExercise.List>
        {Object.keys(groupedExercises)
          .sort()
          .map((key) => {
            return (
              <div key={key} className="pb-2">
                <div className="p-2">{key}</div>
                <div className="space-y-2">
                  {groupedExercises[key].map((each) => {
                    let isSelected = false;
                    const foundExercise = allExercises.find(
                      (e) => e.name === each.name
                    );

                    if (foundExercise) {
                      isSelected = true;
                    }
                    return (
                      <SelectExercise.Item
                        key={`${each.id}_changeExerciseItem`}
                        exercise={each}
                        selected={isSelected}
                        onClick={() => onSelectHandler(each.id)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
      </SelectExercise.List>
    </SelectExercise.Layout>
  );
}

type SelectExerciseProps = {
  muscle?: MusclePriorityType;
  exerciseId: string;
  onSelect: (exercise: JSONExercise) => void;
};
export default function SelectExercise({
  muscle,
  exerciseId,
  onSelect,
}: SelectExerciseProps) {
  return (
    <SelectExerciseProvider muscle={muscle} exerciseId={exerciseId}>
      <SelectExerciseContents onSelect={onSelect} />
    </SelectExerciseProvider>
  );
}
