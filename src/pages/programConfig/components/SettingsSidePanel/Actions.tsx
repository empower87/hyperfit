import { Button } from "~/components/ui/button";
import { useProgramSettingsContext } from "../../hooks/useProgramSettings";

export default function Actions() {
  const { onSaveProgramSettings } = useProgramSettingsContext();
  const onResetConfig = () => {};
  return (
    <div className={`flex w-full justify-end px-3 pb-3`}>
      <Button onClick={onResetConfig} variant="outline">
        Reset
      </Button>

      <Button onClick={onSaveProgramSettings} className={`ml-2 bg-rose-400`}>
        Save Changes
      </Button>
    </div>
  );
}
