import { HTMLAttributes, ReactNode, useState } from "react";
import Configuration from "~/components/Configuration";
import MusclePrioritization from "~/components/Configuration/components/MusclePrioritization/MusclePrioritization";
import { useProgramConfigContext } from "~/components/Configuration/hooks/useProgramConfig";
import { cn } from "~/lib/clsx";

type TempCardProps = {
  header: string;
  children: ReactNode;
};
function TempCard({ header, children }: TempCardProps) {
  return (
    <div className="rounded-lg bg-primary-700 p-4">
      <h2 className="mb-5 text-primary-300">{header}</h2>
      {children}
    </div>
  );
}
export default function ProgramConfig() {
  return (
    <div className="mt-6 flex flex-col">
      <h1 className="mb-5 text-white">Program Configuration</h1>
      <div className="flex space-x-3">
        <div className="h-screen rounded-lg bg-primary-700 p-4">
          <h2 className="mb-5 text-primary-300">Priority</h2>
          <MusclePrioritization />
        </div>
        {/* <TableOfContents /> */}

        <div className="flex flex-col">
          <Configuration>
            <Configuration.Layout>
              <TempCard header="Frequency">
                {/* <Configuration.Periodization /> */}
                <FrequencySelection />
              </TempCard>
              <Configuration.Split>
                <Configuration.SplitSelect />
                <Configuration.SplitWeek />
              </Configuration.Split>

              <Configuration.Actions />
            </Configuration.Layout>
          </Configuration>
          <div>other stuff</div>
        </div>
      </div>
    </div>
  );
}

interface FrequencyButtonProps extends HTMLAttributes<HTMLButtonElement> {
  value: number;
}

const OPTIONS = [1, 2, 3, 4, 5, 6, 7];
function FrequencyButton({ value, className, ...props }: FrequencyButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "h-8 w-8 rounded-md border border-primary-500 bg-primary-600 text-sm font-semibold text-primary-300 hover:bg-primary-500",
        className
      )}
    >
      {value}
    </button>
  );
}
function FrequencySelection() {
  const { frequency, onFrequencyChange } = useProgramConfigContext();
  const [selectedFrequency, setSelectedFrequency] = useState(3);

  const handleSelectChange = (value: number, type: "week" | "day") => {
    if (type === "day") {
      onFrequencyChange([frequency[0], value]);
    } else {
      onFrequencyChange([value, frequency[1]]);
    }
  };

  return (
    <div className="flex">
      <div></div>
      <div className="flex space-x-1">
        {OPTIONS.map((option) => {
          return (
            <FrequencyButton
              value={option}
              className={
                option === selectedFrequency
                  ? "scale-105 border-secondary-300"
                  : ""
              }
              onClick={() => handleSelectChange(option, "day")}
            />
          );
        })}
      </div>
    </div>
  );
}
