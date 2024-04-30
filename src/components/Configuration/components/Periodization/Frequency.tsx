import { Select, SelectLabel } from "~/components/Layout/Select";
import { useProgramConfigContext } from "../../hooks/useProgramConfig";

const OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

function SelectFrequency({
  title,
  selectedOption,
  options,
  onChange,
}: {
  title: string;
  selectedOption: number;
  options: number[];
  onChange: (value: number, type: "week" | "day") => void;
}) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value);
    const type = title === "Weekly Sessions: " ? "week" : "day";
    onChange(value, type);
  };

  return (
    <SelectLabel label={title}>
      <Select
        selectedOption={selectedOption}
        options={options}
        onSelect={handleSelectChange}
      />
    </SelectLabel>
  );
}

export default function Frequency() {
  const { frequency, onFrequencyChange } = useProgramConfigContext();

  const handleSelectChange = (value: number, type: "week" | "day") => {
    if (type === "day") {
      onFrequencyChange([frequency[0], value]);
    } else {
      onFrequencyChange([value, frequency[1]]);
    }
  };

  return (
    <div className={`flex h-full flex-col p-1`}>
      <div className={`pb-1 text-xs text-white`}>Frequency</div>
      <SelectFrequency
        title="Weekly Sessions:"
        options={[...OPTIONS].slice(3)}
        selectedOption={frequency[0]}
        onChange={handleSelectChange}
      />

      <SelectFrequency
        title="Daily Sessions:"
        options={[...OPTIONS].slice(0, frequency[0] + 1)}
        selectedOption={frequency[1]}
        onChange={handleSelectChange}
      />
    </div>
  );
}
