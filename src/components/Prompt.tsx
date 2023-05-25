export default function PromptCard({
  options,
  onChange,
}: {
  options: number[];
  onChange: (value: number) => void;
}) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);
    onChange(selectedValue);
  };

  return (
    <div className="flex rounded border-2 border-gray-600">
      <h1 className="">
        Frequency: How many days per week will you being lifting?
      </h1>

      <select onChange={handleSelectChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
