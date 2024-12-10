import { type NextPage } from "next";
import { SectionH2 as Section } from "~/components/Layout/Sections";

const Home: NextPage = () => {
  return (
    <div id="modal-body" className={"h-full w-full bg-primary-800"}>
      {/* <Configuration>
        <Configuration.Layout>
          <Configuration.Periodization />
          <Configuration.Split>
            <Configuration.SplitSelect />
            <Configuration.SplitWeek />
          </Configuration.Split>

          <Configuration.Actions />
        </Configuration.Layout>
        <Configuration.MusclePrioritization isCollapsed={false} />
      </Configuration> */}

      <Section title="CUSTOMIZE MUSCLE PROGRESSION">
        <h2>Muscle Editor has been moved.</h2>
      </Section>

      <Section title="TRAINING WEEK OVERVIEW">
        <h2>Training Week Overview has been moved.</h2>
      </Section>

      <Section title="TRAINING BLOCK OVERVIEW">
        <h2>Training Block Overview has been moved.</h2>
      </Section>
    </div>
  );
};

// const Home: NextPage = () => {
//   return (
//     <div id="modal-body" className={"flex h-full bg-primary-800"}>
//       <div
//         className={
//           "fixed z-10 flex h-10 w-full items-center justify-center bg-primary-700"
//         }
//       >
//         <h1 className=" text-lg font-bold text-rose-400">Hyperfit</h1>
//       </div>

//       <TrainingProgramProvider>
//         <div className={`mx-auto flex h-max max-w-[1200px] px-3 py-10`}>
//           <TableOfContents />

//           <div className="w-[90%]">
//             <Section title="CONFIGURATION">
//               <Configuration>
//                 <Configuration.MusclePrioritization />

//                 <Configuration.Layout>
//                   <Configuration.Periodization />

//                   <Configuration.Split>
//                     <Configuration.SplitSelect />
//                     <Configuration.SplitWeek />
//                   </Configuration.Split>

//                   <Configuration.Actions />
//                 </Configuration.Layout>
//               </Configuration>
//             </Section>

//             <Section title="CUSTOMIZE MUSCLE PROGRESSION">
//               <MuscleEditor />
//             </Section>

//             <Section title="TRAINING WEEK OVERVIEW">
//               <TrainingWeekOverview />
//             </Section>

//             <Section title="TRAINING BLOCK OVERVIEW">
//               <TrainingBlockOverview />
//             </Section>
//           </div>
//         </div>
//       </TrainingProgramProvider>
//     </div>
//   );
// };

export default Home;
