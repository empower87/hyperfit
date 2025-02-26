import { Button } from "~/components/ui/button";
import { useProgramConfigContext } from "../hooks/useProgramConfig";

export default function Actions() {
  const { onSaveConfig, onResetConfig } = useProgramConfigContext();

  return (
    <div className={`flex w-full justify-end space-x-2 p-3`}>
      <Button onClick={onResetConfig} variant="outline">
        Reset
      </Button>

      <Button onClick={() => onSaveConfig()} className={`bg-rose-400`}>
        Save Changes
      </Button>
    </div>
  );
}
