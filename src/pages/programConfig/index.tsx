import Configuration from "~/components/Configuration";
import MusclePrioritization from "~/components/Configuration/components/MusclePrioritization/MusclePrioritization";

export default function ProgramConfig() {
  return (
    <div className="flex">
      <div className="h-full">
        <MusclePrioritization />
      </div>

      <div className="flex flex-col">
        <Configuration>
          <Configuration.Layout>
            <Configuration.Periodization />
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
  );
}
