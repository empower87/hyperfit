import { ReactNode, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "~/assets/icons/_icons";
import { Button } from "~/components/Layout/Buttons";
import { cn } from "~/lib/clsx";

type SidebarProps = {
  contents: ReactNode;
};
export default function Sidebar({ contents }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onClickHandler = () => setIsExpanded((prev) => !prev);
  return (
    <div
      className={cn(`fixed z-20 h-full w-16 bg-primary-700`, {
        ["w-48"]: isExpanded,
      })}
    >
      <div className="px-4 py-2">
        <h1 className="text-lg font-bold text-rose-400">
          {isExpanded ? "Hyperfit" : "H"}
        </h1>
      </div>

      <div className="flex rounded border-primary-600 px-3 py-2">
        <Button
          className="rounded border border-primary-500"
          onClick={onClickHandler}
        >
          {isExpanded ? (
            <ArrowLeftIcon fill="white" />
          ) : (
            <ArrowRightIcon fill="white" />
          )}
        </Button>
      </div>
      {contents}
    </div>
  );
}
