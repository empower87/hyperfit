type TableCellProps = {
  head: string[];
  body: string[] | [string, number, number, number][];
};

function TH({ text }: { text: string }) {
  const backgroundColor =
    text === "upper"
      ? "bg-blue-400"
      : text === "lower"
      ? "bg-red-400"
      : text === "full"
      ? "bg-purple-400"
      : "bg-slate-400";
  return (
    <th className={backgroundColor + " text-white"} style={{ fontSize: "8px" }}>
      {text}
    </th>
  );
}

function TD({ value }: { value: string | number }) {
  return (
    <td className="border-2 pl-2 text-slate-600" style={{ fontSize: "10px" }}>
      {value}
    </td>
  );
}

export default function Microcycle({ head, body }: TableCellProps) {
  return (
    <td className="pb-1 pt-1">
      <table className="w-full border-collapse">
        <thead>
          <tr className="leading-3">
            {head.map((each) => {
              return <TH key={`${each}_th`} text={each} />;
            })}
          </tr>
        </thead>

        <tbody>
          {body.map((each, index) => {
            return (
              <tr key={`${each}_${index}_tr`} className="leading-none">
                {typeof each === "string"
                  ? each !== "" && <TD value={each} />
                  : each.map((ea, i) => {
                      return (
                        each[1] > 0 &&
                        typeof ea !== "string" && (
                          <TD key={`${ea}_${i}_td_num`} value={ea} />
                        )
                      );
                    })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </td>
  );
}
