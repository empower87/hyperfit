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
      {mesocycleVolumes.map((each, index) => {
        return <Cell key={`${each}_${index}_${width}_lol`} value={each} />;
      })}
    </div>
  );
}
