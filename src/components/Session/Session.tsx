const LayoutHeaderCell = (
  name: string,
  height: string,
  width: string,
  bgColor: string,
  textColor: string
) => {
  return (
    <div className={"flex " + `${height} ` + `${width} ` + `${bgColor}`}>
      <p className={"text-xs " + `${textColor}`}>{name}</p>
    </div>
  );
};

const LayoutHeader = () => {
  return <div></div>;
};

function SessionHeaderLayout() {
  return (
    <div>
      <div>Session</div>
      <div>Week 1</div>
      <div>Week 2</div>
      <div>Week 3</div>
      <div>Week 4</div>
      <div>Deload</div>
    </div>
  );
}
function SessionLayout() {
  return (
    <div>
      <div>
        <div>Session</div>
        <div>{/* -- */}</div>
      </div>

      <div>
        <div>Week 1</div>
        <div>{/* -- */}</div>
      </div>

      <div>
        <div>Week 2</div>
        <div>{/* -- */}</div>
      </div>

      <div>
        <div>Week 3</div>
        <div>{/* -- */}</div>
      </div>

      <div>
        <div>Week 4</div>
        <div>{/* -- */}</div>
      </div>

      <div>
        <div>Deload</div>
        <div>{/* -- */}</div>
      </div>
    </div>
  );
}
