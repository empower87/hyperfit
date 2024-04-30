import { Button } from "~/components/Layout/Buttons";
import { BG_COLOR_M5, BG_COLOR_M7 } from "~/constants/themes";
import { useProgramConfigContext } from "../hooks/useProgramConfig";

export default function Actions() {
  const { onSaveConfig } = useProgramConfigContext();
  const onResetConfig = () => {
    console.log("reset");
  };
  return (
    <div className={`flex justify-end space-x-1 rounded p-2 ${BG_COLOR_M7}`}>
      <Button
        onClick={onResetConfig}
        className={`flex rounded px-2 text-slate-700 ${BG_COLOR_M5}`}
      >
        Reset
      </Button>

      <Button
        onClick={() => onSaveConfig()}
        className={`flex rounded bg-rose-400 px-3 font-bold text-white`}
      >
        Save Changes
      </Button>
    </div>
  );
}
