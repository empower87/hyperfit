import { useEffect, useState } from "react";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
import { useHeadsObserver } from "./useHeadsObserver";

type ContentsType = {
  title: string;
  id: string;
  children: ContentsType[];
};
const CONTENTS: ContentsType[] = [
  {
    title: "Configuration",
    id: "configuration",
    children: [],
  },
  {
    title: "Muscle Editor",
    id: "muscle_editor",
    children: [],
  },
  {
    title: "Exercise Editor",
    id: "exercise_editor",
    children: [],
  },
  {
    title: "Training Block",
    id: "training_block",
    children: [],
  },
];

type ItemProps = {
  title: string;
  id: string;
  activeId: string;
};

function Item({ title, id, activeId }: ItemProps) {
  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a
      href={`#${title}`}
      className={cn(`flex p-0.5 text-xs text-slate-300`, {
        "font-semibold text-rose-400": activeId === id,
      })}
      onClick={(e) => onLinkClick(e)}
    >
      {title}
    </a>
  );
}

type ContentsProps = ContentsType & {
  activeId: string;
};
function Contents({ title, id, activeId, children }: ContentsProps) {
  return (
    <div className={``}>
      <Item title={title} id={id} activeId={activeId} />
      <div className={`flex flex-col space-y-1 pl-2`}>
        {children.map((child, index) => {
          return (
            <Item
              key={`${child.id}_${index}_ContentItem`}
              title={child.title}
              id={child.id}
              activeId={activeId}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function TableOfContents() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const { activeId } = useHeadsObserver();
  const [contents, setContents] = useState<ContentsType[]>([...CONTENTS]);

  useEffect(() => {
    const muscleEditorChildren = prioritized_muscle_list.map((muscle) => {
      const name = getMuscleTitleForUI(muscle.muscle);
      return { title: name, id: muscle.muscle, children: [] };
    });
    const newContents = [...CONTENTS];
    newContents[1].children = muscleEditorChildren;
    setContents(newContents);
  }, [prioritized_muscle_list]);

  return (
    <aside
      className={`sticky top-[60px] m-2 flex h-full  flex-col items-end self-start overflow-y-auto overflow-x-hidden rounded`}
    >
      <div className={`rounded border-2 border-primary-600 px-2 py-3`}>
        <div className={`my-3 text-xxs text-white`}>TABLE OF CONTENTS</div>
        <div className={`flex flex-col space-y-1`}>
          {contents.map((contents, index) => {
            return (
              <Contents
                key={`${contents.id}_${index}_ContentItem`}
                {...contents}
                activeId={activeId}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}
