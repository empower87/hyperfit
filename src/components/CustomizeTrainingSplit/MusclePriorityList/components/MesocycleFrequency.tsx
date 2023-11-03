import { BG_COLOR_M5, BG_COLOR_M6 } from "~/utils/themes";
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
      <div className={" text-xxs p-1"}>{currentValue}</div>
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
};

function EditMesocycleFrequency({
  mesoProgression,
  total_sessions,
  onEdit,
}: EditMesocycleFrequencyProps) {
  const { canAddList, canSubList, onAddSubHandler, currentMesoProgression } =
    useEditMesocycleFrequency(mesoProgression, total_sessions);

  const cancel = () => {
    onEdit(false);
  };

  const save = () => {
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

type DefaultMesocycleFrequencyProps = {
  mesoProgression: number[];
  onEdit: (isEditing: true) => void;
};

function DefaultMesocycleFrequency({
  mesoProgression,
  onEdit,
}: DefaultMesocycleFrequencyProps) {
  return (
    <div className=" flex w-full">
      <div className=" flex w-1/3 justify-center">{mesoProgression[0]}</div>
      <div className=" flex w-1/3 justify-center">{mesoProgression[1]}</div>
      <div className=" flex w-1/3 justify-center">{mesoProgression[2]}</div>
      <button className="  bg-blue-600 pl-1 pr-1" onClick={() => onEdit(true)}>
        edit
      </button>
    </div>
  );
}

type MesocycleFrequencyProps = {
  mesoProgression: number[];
  total_sessions: [number, number];
  isEditing: boolean;
  onEditHandler: (isEditing: boolean) => void;
  width: string;
};
export default function MesocycleFrequency({
  mesoProgression,
  total_sessions,
  isEditing,
  onEditHandler,
  width,
}: MesocycleFrequencyProps) {
  return (
    <div className={width + " flex justify-center"}>
      {isEditing ? (
        <EditMesocycleFrequency
          mesoProgression={mesoProgression}
          total_sessions={total_sessions}
          onEdit={onEditHandler}
        />
      ) : (
        <DefaultMesocycleFrequency
          mesoProgression={mesoProgression}
          onEdit={onEditHandler}
        />
      )}
    </div>
  );
}
