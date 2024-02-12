import { useEffect, useState } from "react";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/constants/themes";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import useEditMesocycleFrequency from "../hooks/useEditMesocycleFrequency";

type CellWithCounterProps = {
  mesocycle: number;
  currentValue: number;
  canAdd: boolean;
  canSub: boolean;
  onAddSubtract: (type: "add" | "sub", mesocycle: number) => void;
};

function CellWithCounter({
  mesocycle,
  currentValue,
  canAdd,
  canSub,
  onAddSubtract,
}: CellWithCounterProps) {
  return (
    <div className=" mr-2 flex items-center justify-center">
      <button
        className={BG_COLOR_M6 + " h-4 w-4 text-xs font-bold"}
        onClick={() => onAddSubtract("sub", mesocycle)}
        disabled={!canSub}
      >
        -
      </button>
      <div className={" p-1 text-xxs"}>{currentValue}</div>
      <button
        className={BG_COLOR_M6 + " h-4 w-4 text-xs font-bold"}
        onClick={() => onAddSubtract("add", mesocycle)}
        disabled={!canAdd}
      >
        +
      </button>
    </div>
  );
}

type EditMesocycleFrequencyProps = {
  mesoProgression: number[];
  total_sessions: [number, number];
  onEdit: (isEditing: boolean) => void;
  onMesoProgressionUpdate: (newMesoProgression: number[]) => void;
};

function EditMesocycleFrequency({
  mesoProgression,
  total_sessions,
  onEdit,
  onMesoProgressionUpdate,
}: EditMesocycleFrequencyProps) {
  const { canAddList, canSubList, onAddSubHandler, currentMesoProgression } =
    useEditMesocycleFrequency(mesoProgression, total_sessions);

  const cancel = () => {
    onEdit(false);
  };

  const save = () => {
    onMesoProgressionUpdate(currentMesoProgression);
    onEdit(false);
  };

  return (
    <div className=" flex">
      <CellWithCounter
        mesocycle={1}
        currentValue={currentMesoProgression[0]}
        canAdd={canAddList[0]}
        canSub={canSubList[0]}
        onAddSubtract={onAddSubHandler}
      />
      <CellWithCounter
        mesocycle={2}
        currentValue={currentMesoProgression[1]}
        canAdd={canAddList[1]}
        canSub={canSubList[1]}
        onAddSubtract={onAddSubHandler}
      />
      <CellWithCounter
        mesocycle={3}
        currentValue={currentMesoProgression[2]}
        canAdd={canAddList[2]}
        canSub={canSubList[2]}
        onAddSubtract={onAddSubHandler}
      />
      <div className=" flex items-center">
        <button
          className={BG_COLOR_M5 + " mr-1 h-4 w-4 rounded-full font-bold"}
          onClick={cancel}
        >
          x
        </button>
        <button
          className={"h-4 w-4 rounded-full bg-blue-600 font-bold"}
          onClick={save}
        >
          ok
        </button>
      </div>
    </div>
  );
}

type MesocycleFrequencyProps = {
  muscle: MusclePriorityType;
  maxFrequency: number;
  mesoProgression: number[];
  selectedProgressionIndex: number | null;
  onFrequencyChangeClickHandler: (
    muscle: MusclePriorityType,
    operator: "add" | "subtract"
  ) => void;
};

const canPerformOperation = (
  selectedIndex: number | null,
  frequencyProgression: number[],
  maxFrequency: number
) => {
  let first = frequencyProgression[0];
  let last = frequencyProgression[frequencyProgression.length - 1];

  const operations = {
    add: false,
    sub: false,
  };
  if (selectedIndex === null) {
    if (first > 0) {
      operations.sub = true;
    } else {
      operations.sub = false;
    }
    if (last < maxFrequency) {
      operations.add = true;
    } else {
      operations.add = false;
    }
  } else {
    first = frequencyProgression[selectedIndex - 1];
    last = frequencyProgression[selectedIndex + 1];
    if (frequencyProgression[selectedIndex] - 1 >= 0) {
      operations.sub = true;
    }
    if (frequencyProgression[selectedIndex] + 1 <= last) {
      operations.add = true;
    }
  }
  return operations;
};

type SelectedMesocycle = {
  index: number | null;
  add: boolean;
  subtract: boolean;
};

const SELECTED_MESOCYCLE: SelectedMesocycle = {
  index: null,
  add: true,
  subtract: true,
};
export default function MesocycleFrequency({
  muscle,
  maxFrequency,
  mesoProgression,
  selectedProgressionIndex,
  onFrequencyChangeClickHandler,
}: MesocycleFrequencyProps) {
  const [frequencyProgression, setFrequencyProgression] = useState<number[]>([
    ...mesoProgression,
  ]);
  const [selectedMesocycle, setSelectedMesocycle] = useState<SelectedMesocycle>(
    { ...SELECTED_MESOCYCLE }
  );

  useEffect(() => {
    setFrequencyProgression([...mesoProgression]);
  }, [mesoProgression]);

  useEffect(() => {
    const { add, sub } = canPerformOperation(
      selectedMesocycle.index,
      frequencyProgression,
      maxFrequency
    );

    // console.log(add, sub, "What is happening here");

    setSelectedMesocycle({
      index: selectedMesocycle.index,
      add: add,
      subtract: sub,
    });
  }, [frequencyProgression, selectedMesocycle.index, maxFrequency]);

  const onFrequencyChange = (operator: "add" | "subtract") => {
    const items = [...frequencyProgression];
    if (selectedMesocycle.index === null) {
      // onFrequencyChangeClickHandler(muscle, operator)
      if (operator === "add" && selectedMesocycle.add) {
        items[items.length - 1] = items[items.length - 1] + 1;
      } else if (operator === "subtract" && selectedMesocycle.subtract) {
        items[0] = items[0] - 1;
      }
    } else {
      const prevIndex = selectedMesocycle.index - 1;
      const nextIndex = selectedMesocycle.index + 1;
      if (operator === "add" && selectedMesocycle.add) {
        items[selectedMesocycle.index] = items[selectedMesocycle.index] + 1;
        const canAdd = canPerformOperation(
          nextIndex,
          frequencyProgression,
          maxFrequency
        );
        setSelectedMesocycle({
          ...selectedMesocycle,
          add: canAdd.add,
          subtract: canAdd.sub,
        });
      } else if (operator === "subtract" && selectedMesocycle.subtract) {
        items[selectedMesocycle.index] = items[selectedMesocycle.index] - 1;
        const canSub = canPerformOperation(
          prevIndex,
          frequencyProgression,
          maxFrequency
        );
        setSelectedMesocycle({
          ...selectedMesocycle,
          add: canSub.add,
          subtract: canSub.sub,
        });
      }
    }
    setFrequencyProgression(items);
  };

  const onFrequencyIndexClick = (index: number) => {
    if (selectedMesocycle.index === index) {
      const canPerform = canPerformOperation(
        null,
        frequencyProgression,
        maxFrequency
      );
      setSelectedMesocycle({
        index: null,
        add: canPerform.add,
        subtract: canPerform.sub,
      });
    } else {
      const canPerform = canPerformOperation(
        index,
        frequencyProgression,
        maxFrequency
      );
      setSelectedMesocycle({
        index: index,
        add: canPerform.add,
        subtract: canPerform.sub,
      });
    }
  };

  return (
    <>
      {/* <Button
        className={`h-4 w-4 ${BG_COLOR_M6} font-bold text-white hover:${BG_COLOR_M5}`}
        onClick={() => onFrequencyChange("subtract")}
      >
        -
      </Button> */}

      <div className="flex">
        {frequencyProgression.map((meso, index) => {
          return (
            <CounterCell
              key={`${meso}_${index}_frequency_meso_${muscle}`}
              value={meso}
              minMaxValues={[0, maxFrequency]}
              frequencyProgression={frequencyProgression}
            />
            // <Cell
            //   key={`${meso}_${index}_frequency_meso_${muscle}`}
            //   className={`h-6 w-6 items-center justify-center hover:bg-slate-400 ${
            //     selectedMesocycle.index !== null &&
            //     selectedMesocycle.index === index
            //       ? "bg-slate-400"
            //       : "bg-inherit"
            //   }`}
            //   width={""}
            //   onClick={() => onFrequencyIndexClick(index)}
            // >
            //   {meso}
            // </Cell>
          );
        })}
      </div>

      {/* <Button
        className={`h-4 w-4 ${BG_COLOR_M6} font-bold text-white hover:${BG_COLOR_M5}`}
        onClick={() => onFrequencyChange("add")}
      >
        +
      </Button> */}
    </>
  );
}

type CounterCellProps = {
  value: number;
  minMaxValues: [number, number];
  frequencyProgression: number[];
};
export function CounterCell({
  value,
  minMaxValues,
  frequencyProgression,
}: CounterCellProps) {
  const [current, setCurrent] = useState<number>(value);

  const onAddHandler = () => {};
  const onSubHandler = () => {};

  return (
    <div
      className={cn(
        `m-0.5 flex h-5 w-12 items-center justify-center border-2 text-xs text-slate-300`
      )}
    >
      <div className="flex w-1/3 items-center justify-center  hover:bg-red-600">
        -
      </div>
      <div className="flex w-1/3 items-center justify-center">{current}</div>
      <div className="flex w-1/3 items-center justify-center  hover:bg-red-600">
        +
      </div>
    </div>
  );
}

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  increment: "+" | "-";
  onIncrement: (operator: "+" | "-") => void;
}
function Button({ increment, onIncrement, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(`flex h-full w-1/3 items-center justify-center`, className)}
      onClick={() => onIncrement(increment)}
    >
      {increment}
    </button>
  );
}

Counter.Button = Button;
type CounterProps = {
  value: number;
  minMaxValues: [number, number];
  onIncrement: (value: number) => void;
};
export function Counter({ value, minMaxValues, onIncrement }: CounterProps) {
  const [current, setCurrent] = useState<number>(value);

  const onIncrementHandler = (increment: "+" | "-") => {
    if (increment === "+") {
      if (current + 1 > minMaxValues[1]) return;
      setCurrent((prev) => prev + 1);
      onIncrement(value + 1);
    } else {
      if (current - 1 < minMaxValues[0]) return;
      setCurrent((prev) => prev - 1);
      onIncrement(value - 1);
    }
  };

  return (
    <div
      className={cn(
        `m-0.5 flex h-5 w-12 items-center justify-center border-2 text-xs text-slate-300`
      )}
    >
      <Counter.Button increment={"-"} onIncrement={onIncrementHandler} />
      <div className="flex w-1/3 items-center justify-center">{current}</div>
      <Counter.Button increment={"+"} onIncrement={onIncrementHandler} />
    </div>
  );
}
// type MesocycleFrequencyProps = {
//   mesoProgression: number[];
//   total_sessions: [number, number];
//   isEditing: boolean;
//   onEditHandler: (isEditing: boolean) => void;
//   width: string;
//   onMesoProgressionUpdate: (newMesoProgression: number[]) => void;
// };

// export default function MesocycleFrequency({
//   mesoProgression,
//   total_sessions,
//   isEditing,
//   onEditHandler,
//   width,
//   onMesoProgressionUpdate,
// }: MesocycleFrequencyProps) {
//   return (
//     <div className={" flex w-full justify-center"}>
//       {isEditing ? (
//         <EditMesocycleFrequency
//           mesoProgression={mesoProgression}
//           total_sessions={total_sessions}
//           onEdit={onEditHandler}
//           onMesoProgressionUpdate={onMesoProgressionUpdate}
//         />
//       ) : (
//         <DefaultMesocycleFrequency
//           mesoProgression={mesoProgression}
//           onEdit={onEditHandler}
//         />
//       )}
//     </div>
//   );
// }
// export default function MesocycleFrequency({
//   mesoProgression,
//   total_sessions,
//   isEditing,
//   onEditHandler,
//   width,
//   onMesoProgressionUpdate,
// }: MesocycleFrequencyProps) {
//   return (
//     <div className={" flex justify-center"} style={{ width: width }}>
//       {isEditing ? (
//         <EditMesocycleFrequency
//           mesoProgression={mesoProgression}
//           total_sessions={total_sessions}
//           onEdit={onEditHandler}
//           onMesoProgressionUpdate={onMesoProgressionUpdate}
//         />
//       ) : (
//         <DefaultMesocycleFrequency
//           mesoProgression={mesoProgression}
//           onEdit={onEditHandler}
//         />
//       )}
//     </div>
//   );
// }
