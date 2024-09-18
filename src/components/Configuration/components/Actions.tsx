import { Button } from "~/components/Layout/Buttons";
import { useProgramConfigContext } from "../hooks/useProgramConfig";

export default function Actions() {
  const { onSaveConfig, onResetConfig } = useProgramConfigContext();

  return (
    <div className={`flex justify-end space-x-1 rounded p-2 bg-primary-700`}>
      <Button
        onClick={onResetConfig}
        className={`flex rounded px-2 text-slate-700 bg-primary-500`}
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
