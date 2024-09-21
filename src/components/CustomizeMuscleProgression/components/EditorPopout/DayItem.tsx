type DayItemProps = {
  index: number;
};

export default function DayItem({ index }: DayItemProps) {
  return (
    <div className="flex w-52 flex-col bg-primary-500">
      <div className="flex p-1 indent-1 text-sm text-white">
        Day {index + 1}
      </div>
      <ul className="flex flex-col border-primary-500 bg-primary-700 p-1"></ul>
    </div>
  );
}

type SessionProps = {
  index: number;
};
function Session({ index }: SessionProps) {
  return (
    <div className="bg-primary-600">
      <div className="flex indent-1 text-white">Session {index} </div>
    </div>
  );
}
