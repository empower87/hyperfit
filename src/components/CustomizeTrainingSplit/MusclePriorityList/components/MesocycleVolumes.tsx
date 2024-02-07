type CellProps = {
  value: number;
};

function Cell({ value }: CellProps) {
  return <div className=" flex w-1/3 justify-center">{value}</div>;
}

type MesocycleVolumesProps = {
  mesocycleVolumes: number[];
  width: string;
};

export function MesocycleVolumes({
  mesocycleVolumes,
  width,
}: MesocycleVolumesProps) {
  return (
    <div className={" flex"} style={{ width: width }}>
      {mesocycleVolumes.map((each) => {
        return <Cell value={each} />;
      })}
    </div>
  );
}
