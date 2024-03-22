import { type NextPage } from "next";
import PageContent from "~/components/CustomizeTrainingSplit/CustomizeTrainingSplit";
import { BG_COLOR_M7, BG_COLOR_M8 } from "~/constants/themes";

const Home: NextPage = () => {
  return (
    <div id="modal-body" className={BG_COLOR_M8 + " m-auto h-full"}>
      <div
        className={
          BG_COLOR_M7 +
          " fixed z-10 flex h-10 w-full items-center justify-center"
        }
      >
        <h1 className=" text-lg font-bold text-white">Hyperfit</h1>
      </div>

      <PageContent />
    </div>
  );
};

export default Home;
