import { Button } from "~/components/ui/button";
import { useProgramConfigContext } from "../hooks/useProgramConfig";

export default function Actions() {
  const { onSaveConfig, onResetConfig } = useProgramConfigContext();

  return (
    <div className={`flex justify-end space-x-1 rounded bg-primary-700 p-2`}>
      <Button
        onClick={onResetConfig}
        className={`flex rounded bg-primary-500 px-2 text-slate-700`}
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
