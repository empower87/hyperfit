import { Button } from "~/components/ui/button";

type ActionsProps = {
  onSaveConfig: () => void;
};
export default function Actions({ onSaveConfig }: ActionsProps) {
  // const { onSaveConfig, onResetConfig } = useProgramConfigContext();
  const onResetConfig = () => {};
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
