import { Button } from "~/components/ui/button";
import { useProgramConfigContext } from "../hooks/useProgramConfig";

export default function Actions() {
  const { onSaveConfig, onResetConfig } = useProgramConfigContext();

  return (
    <div className={`flex justify-start space-x-1 pt-5`}>
      <Button onClick={onResetConfig} variant="outline">
        Reset
      </Button>

      <Button onClick={() => onSaveConfig()} className={`bg-rose-400`}>
        Save Changes
      </Button>
    </div>
  );
}
