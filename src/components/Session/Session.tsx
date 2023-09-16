import useTrainingBlock from "~/hooks/useTrainingBlockTest";

const LayoutHeaderCell = ({
  name,
  height,
  width,
  bgColor,
  textColor,
}: {
  name: string;
  height: string;
  width: string;
  bgColor: string;
  textColor: string;
}) => {
  return (
    <div className={"flex " + `${height} ` + `${width} ` + `${bgColor}`}>
      <p className={"text-xs " + `${textColor}`}>{name}</p>
    </div>
  );
};

const LayoutHeader = ({ headers }: { headers: string[] }) => {
  return (
    <div>
      {headers.map((each) => {
        return (
          <LayoutHeaderCell
            name={each}
            height={"h-5"}
            width={"w-6"}
            bgColor="bg-slate-600"
            textColor="text-white"
          />
        );
      })}
    </div>
  );
};

const LayoutRows = ({ data }: { data: any[] }) => {
  return (
    <div>
      {data.map((each) => {
        return (
          <LayoutHeaderCell
            name={each}
            height={"h-5"}
            width={"w-6"}
            bgColor="bg-slate-600"
            textColor="text-white"
          />
        );
      })}
    </div>
  );
};

function LayoutSection({ headers, rows }: { headers: string[]; rows: any[] }) {
  return (
    <div className="flex flex-col">
      <LayoutHeader headers={headers} />
      <LayoutRows data={rows} />
    </div>
  );
}
function SessionHeaderLayout() {
  return (
    <div>
      <div></div>
      <div>Session</div>
      <div>Week 1</div>
      <div>Week 2</div>
      <div>Week 3</div>
      <div>Week 4</div>
      <div>Deload</div>
    </div>
  );
}
const SessionDayLayout = ({
  day,
  double,
}: {
  day: string;
  double: boolean;
}) => {
  return (
    <div>
      <div>
        {day}
        {double ? "early: " : ""}
      </div>
      {double ? <div>late: </div> : null}
    </div>
  );
};

const SESSION_HEADERS = ["#", "Group", "Exercise", "Category", "Modality"];
const WEEK_ONE_HEADERS = ["Sets", "Reps", "Weight", "RIR"];
const WEEK_TWO_TO_DELOAD_HEADERS = ["Sets", "Weight", "RIR"];

function SessionLayout({
  split,
  list,
  totalSessions,
  splitTest,
}: {
  split: SessionType[];
  list: MusclePriorityType[];
  totalSessions: [number, number];
  splitTest: SessionDayType[];
}) {
  const { trainingBlock } = useTrainingBlock(
    split,
    list,
    totalSessions,
    splitTest
  );

  return (
    <div className="flex flex-col">
      <SessionHeaderLayout />
      <div className="flex">
        <SessionDayLayout />
        <div className="flex">
          <LayoutSection headers={SESSION_HEADERS} rows={rows} />
          <LayoutSection headers={WEEK_ONE_HEADERS} rows={rows} />
          <LayoutSection headers={WEEK_TWO_TO_DELOAD_HEADERS} rows={rows} />
          <LayoutSection headers={WEEK_TWO_TO_DELOAD_HEADERS} rows={rows} />
          <LayoutSection headers={WEEK_TWO_TO_DELOAD_HEADERS} rows={rows} />
          <LayoutSection headers={WEEK_TWO_TO_DELOAD_HEADERS} rows={rows} />
        </div>
      </div>
    </div>
  );
}
