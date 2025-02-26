import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";
import Actions from "./components/Actions";
import FrequencySelection from "./components/FrequencySelection";
import { MusclePrioritizationList } from "./components/MusclePrioritization";
import { Split } from "./components/Split/SplitOverview";
import CustomizationTabs from "./components/Tabs";
import { ProgramConfigProvider } from "./hooks/useProgramConfig";

export default function ProgramConfig() {
  return (
    <TrainingProgramProvider>
      <div className="flex h-full space-x-5">
        <ProgramConfiguration />

        <div className="flex h-full flex-col space-y-3 overflow-y-scroll pb-14 pr-1 pt-8">
          <h1 className="mb-5 text-white">Program Configuration</h1>
          <div className="flex flex-col rounded-lg">
            <CustomizationTabs />
          </div>
        </div>
      </div>
    </TrainingProgramProvider>
  );
}

// export default function ProgramConfig() {
//   return (
//     <div className="flex h-full flex-col pt-10">
//       <h1 className="mb-5 text-white">Program Configuration</h1>
//       <TrainingProgramProvider>
//         <ProgramConfigProvider>
//           <div className="flex h-full space-x-5">
//             <div className="h-full">
//               <MusclePrioritization />
//             </div>

//             <div className="flex h-full flex-col space-y-3 overflow-y-scroll pb-14 pr-1">
//               <div className="flex flex-col space-y-3">
//                 <div className="flex w-full space-x-3">
//                   <Card>
//                     <CardHeader>2. Frequency</CardHeader>
//                     <CardContent>
//                       <FrequencySelection />
//                     </CardContent>
//                   </Card>

//                   <Card className="w-full">
//                     <CardHeader>3. Split</CardHeader>
//                     <CardContent>
//                       <Split />
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <Card>
//                   <CardHeader>Split Overview</CardHeader>
//                   <CardContent>
//                     <TrainingWeek />
//                     <Actions />
//                   </CardContent>
//                 </Card>
//               </div>

//               <div className="flex flex-col rounded-lg">
//                 <CustomizationTabs />
//               </div>
//             </div>
//           </div>
//         </ProgramConfigProvider>
//       </TrainingProgramProvider>
//     </div>
//   );
// }

function ProgramConfiguration() {
  const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);

  const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  const onExpandPriorityList = () => setIsPriorityListCollapsed(false);
  return (
    <ProgramConfigProvider>
      <div className="flex h-full flex-col justify-between bg-primary-600">
        <div className="flex items-center justify-between">
          <h2 className="p-2">Configuration</h2>
          <div className="p-2">
            {isPriorityListCollapsed ? (
              <Button
                className="bg-card"
                variant="outline"
                size="icon"
                onClick={onExpandPriorityList}
              >
                <ChevronRightIcon />
              </Button>
            ) : (
              <Button
                className="bg-card"
                variant="outline"
                size="icon"
                onClick={onCollapsePriorityList}
              >
                <ChevronLeftIcon />
              </Button>
            )}
          </div>
        </div>

        <div className="flex h-full space-x-3">
          {isPriorityListCollapsed ? (
            <></>
          ) : (
            <>
              <ProgramConfigOptionCard title="1. Prioritize">
                <MusclePrioritizationList
                  isCollapsed={isPriorityListCollapsed}
                />
              </ProgramConfigOptionCard>

              <div className="flex flex-col space-y-3">
                <ProgramConfigOptionCard title="2. Frequency">
                  <FrequencySelection />
                </ProgramConfigOptionCard>

                <ProgramConfigOptionCard title="3. Split">
                  <Split />
                </ProgramConfigOptionCard>
              </div>
            </>
          )}
        </div>

        <Actions />
      </div>
    </ProgramConfigProvider>
  );
}

// function ProgramConfiguration() {
//   const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);

//   const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
//   const onExpandPriorityList = () => setIsPriorityListCollapsed(false);
//   return (
//     <ProgramConfigProvider>
//       <div className="flex h-full space-x-5 bg-primary-600 py-4">
//         <Card className="border-none bg-primary-600">
//           <CardHeader>
//             <div className="flex items-center justify-between space-x-2 pb-2">
//               <CardTitle>Configuration</CardTitle>
//               {isPriorityListCollapsed ? (
//                 <Button
//                   className="bg-card"
//                   variant="outline"
//                   size="icon"
//                   onClick={onExpandPriorityList}
//                 >
//                   <ChevronRightIcon />
//                 </Button>
//               ) : (
//                 <Button
//                   className="bg-card"
//                   variant="outline"
//                   size="icon"
//                   onClick={onCollapsePriorityList}
//                 >
//                   <ChevronLeftIcon />
//                 </Button>
//               )}
//             </div>
//           </CardHeader>

//           <CardContent>
//             {isPriorityListCollapsed ? (
//               <></>
//             ) : (
//               <>
//                 <div className="flex flex-col space-y-3">
//                   <div className="flex space-x-3">
//                     <ProgramConfigOptionCard title="1. Frequency">
//                       <FrequencySelection />
//                     </ProgramConfigOptionCard>

//                     <ProgramConfigOptionCard title="2. Split">
//                       <Split />
//                     </ProgramConfigOptionCard>
//                   </div>
//                   <MusclePrioritizationList
//                     isCollapsed={isPriorityListCollapsed}
//                   />
//                 </div>
//               </>
//             )}
//           </CardContent>
//           <CardFooter>
//             <Actions />
//           </CardFooter>
//         </Card>
//       </div>
//     </ProgramConfigProvider>
//   );
// }

type ProgramConfigOptionCardProps = {
  title: string;
  children: ReactNode;
};
function ProgramConfigOptionCard({
  title,
  children,
}: ProgramConfigOptionCardProps) {
  return (
    <div className="flex flex-col">
      <h2 className="p-2 pb-1 text-xs font-semibold text-muted-foreground">
        {title}
      </h2>
      {children}
    </div>
  );
}
