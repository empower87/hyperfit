import { ReactNode, useCallback, useState } from "react";
import { FilterIcon, SearchIcon } from "~/assets/icons/_icons";
import { Button } from "~/components/CustomizeTrainingSplit/MusclePriorityList/MusclePriorityList";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BG_COLOR_M8,
  BORDER_COLOR_M5,
} from "~/constants/themes";
import { useOutsideClick } from "~/hooks/useOnOutsideClick";
import { cn } from "~/lib/clsx";
import { Exercise } from "~/utils/getExercises";
import {
  FilterTagsKey,
  useChangeExerciseContext,
} from "./ChangeExerciseContext";

function Header({ children }: { children: ReactNode }) {
  return <div className={"flex justify-between"}>{children}</div>;
}
function Search() {
  return (
    <div className={cn(`m-1 flex w-1/2 indent-1 text-white ${BG_COLOR_M8}`)}>
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
        className={cn(`flex ${BG_COLOR_M6} mb-2 indent-1 text-xs text-white`)}
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
type FilterMenuProps = {
  onSelectTag: (key: FilterTagsKey, value: string | null) => void;
};
function FilterMenu({ onSelectTag }: FilterMenuProps) {
  return (
    <div
      className={cn(
        `absolute right-0 flex flex-col space-y-1 p-2 ${BG_COLOR_M7} border ${BORDER_COLOR_M5}`
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
  const { filterTags, onFilterTagChange } = useChangeExerciseContext();
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
      <div className={`flex w-11/12 flex-wrap text-xxs`}>
        {Object.values(filterTags).map((each) => {
          if (each == null) return null;
          return <FilterTag tag={each} onRemoveTag={onRemoveTag} />;
        })}
      </div>

      <div className={`w-1/12`}>
        <Button onClick={onClick} className="">
          <FilterIcon className="fill-white text-sm" />
        </Button>
      </div>

      {showMenu ? <FilterMenu onSelectTag={onFilterTagChange} /> : null}
    </div>
  );
}
function Layout({ children }: { children: ReactNode }) {
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
type ItemTagProps = {
  name: string;
  selected: string;
};
function ItemTag({ name, selected }: ItemTagProps) {
  return (
    <div className={cn(`flex items-center justify-center border text-xxs`)}>
      {name}
    </div>
  );
}
type ItemProps = {
  exercise: Exercise;
  selected: boolean;
};
function Item({ exercise, selected }: ItemProps) {
  const { onSelectExerciseHandler, selectedExerciseId, exerciseId } =
    useChangeExerciseContext();
  return (
    <div
      onClick={() => onSelectExerciseHandler(exercise.id)}
      className={cn(
        `flex p-1 indent-1 text-xs text-slate-400 ${BG_COLOR_M6} cursor-pointer hover:${BG_COLOR_M5}`,
        {
          [`${BG_COLOR_M5}`]:
            exerciseId === exercise.id || exercise.id === selectedExerciseId,
        }
      )}
    >
      <div className={"flex w-4/12 flex-col"}>
        <div className={`mr-2 flex`}>
          <div>{exercise.name}</div>
          {selected ? (
            <div className={`text-xxs font-bold text-white `}>Selected</div>
          ) : null}
        </div>
        <div className={`flex space-x-1`}>
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
    </div>
  );
}
function List({ children }: { children: ReactNode }) {
  const { onSortHandler } = useChangeExerciseContext();
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
    <div className={cn(`flex flex-col p-2`)}>
      <div className={cn(`mb-2 flex border-b-2 indent-1 text-xs text-white`)}>
        <div className={`w-4/12`}>Exercises</div>
        <div
          onClick={() => onClickHandler("rank")}
          className={cn(`w-1/12 cursor-pointer hover:${BG_COLOR_M6}`, {
            [`${BG_COLOR_M5}`]: sortedByIndicator === "rank",
          })}
        >
          Ranked
        </div>
        <div
          onClick={() => onClickHandler("stretch", "lengthened")}
          className={cn(`w-1/12 cursor-pointer hover:${BG_COLOR_M6}`, {
            [`${BG_COLOR_M5}`]: sortedByIndicator === "lengthened",
          })}
        >
          Length
        </div>
        <div
          onClick={() => onClickHandler("stretch", "challenging")}
          className={cn(`w-1/12 cursor-pointer hover:${BG_COLOR_M6}`, {
            [`${BG_COLOR_M5}`]: sortedByIndicator === "challenging",
          })}
        >
          Chall.
        </div>
        <div
          onClick={() => onClickHandler("limiting_factor")}
          className={cn(`w-1/12 cursor-pointer hover:${BG_COLOR_M6}`, {
            [`${BG_COLOR_M5}`]: sortedByIndicator === "limiting_factor",
          })}
        >
          Limit
        </div>
        <div
          onClick={() => onClickHandler("loadability")}
          className={cn(`w-1/12 cursor-pointer hover:${BG_COLOR_M6}`, {
            [`${BG_COLOR_M5}`]: sortedByIndicator === "loadability",
          })}
        >
          Load
        </div>
        <div
          onClick={() => onClickHandler("stability")}
          className={cn(`w-1/12 cursor-pointer hover:${BG_COLOR_M6}`, {
            [`${BG_COLOR_M5}`]: sortedByIndicator === "stability",
          })}
        >
          Stable
        </div>
        <div
          onClick={() => onClickHandler("target_function")}
          className={cn(`w-1/12 cursor-pointer hover:${BG_COLOR_M6}`, {
            [`${BG_COLOR_M5}`]: sortedByIndicator === "target_function",
          })}
        >
          Target
        </div>
        <div
          onClick={() => onClickHandler("time_efficiency")}
          className={cn(`w-1/12 cursor-pointer hover:${BG_COLOR_M6}`, {
            [`${BG_COLOR_M5}`]: sortedByIndicator === "time_efficiency",
          })}
        >
          Time
        </div>
      </div>

      <div className={cn(`flex h-60 flex-col overflow-y-auto`)}>{children}</div>
    </div>
  );
}

SelectExercise.List = List;
SelectExercise.Layout = Layout;
SelectExercise.Item = Item;
SelectExercise.Header = Header;
SelectExercise.Search = Search;
SelectExercise.Filter = Filter;

function SelectExercise() {
  const { exercises, allExercises, onSaveExerciseHandler } =
    useChangeExerciseContext();

  console.log(exercises, "YO WTF???");
  return (
    <SelectExercise.Layout>
      <SelectExercise.Header>
        <SelectExercise.Search />
        <SelectExercise.Filter />
      </SelectExercise.Header>

      <SelectExercise.List>
        {exercises.map((each) => {
          let isSelected = false;
          const foundExercise = allExercises.find(
            (e) => e.exercise === each.name
          );

          if (foundExercise) {
            isSelected = true;
          }
          return <SelectExercise.Item exercise={each} selected={isSelected} />;
        })}
      </SelectExercise.List>

      <div className={`flex items-center justify-end p-2`}>
        <button
          onClick={() => onSaveExerciseHandler()}
          className={cn(`bg-rose-400 px-2 text-xs text-white`)}
        >
          Saved
        </button>
      </div>
    </SelectExercise.Layout>
  );
}

export default SelectExercise;
