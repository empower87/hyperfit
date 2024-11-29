import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/clsx";

type SidebarProps = {
  contents: ReactNode;
};
export default function Sidebar({ contents }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onClickHandler = () => setIsExpanded((prev) => !prev);
  return (
    <div
      className={cn(
        `fixed top-0 z-20 h-full w-16 space-y-2 bg-primary-700 p-3`,
        {
          ["w-48"]: isExpanded,
        }
      )}
    >
      <div className="flex items-center justify-center">
        <h1 className="text-lg font-bold text-rose-400">
          {isExpanded ? "Hyperfit" : "H"}
        </h1>
      </div>

      <div className="flex rounded border-primary-600">
        <Button
          size="icon"
          className="border border-input bg-card"
          onClick={onClickHandler}
        >
          {isExpanded ? (
            <ChevronLeftIcon fill="white" />
          ) : (
            <ChevronRightIcon fill="white" />
          )}
        </Button>
      </div>
      {contents}
    </div>
  );
}
