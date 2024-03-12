import { type NextPage } from "next";
import PageContent from "~/components/CustomizeTrainingSplit/CustomizeTrainingSplit";
import { BG_COLOR_M6, BG_COLOR_M7, BG_COLOR_M8 } from "~/constants/themes";

const Home: NextPage = () => {
  return (
    <div
      id="modal-body"
      className={BG_COLOR_M8 + " flex h-screen w-full flex-col"}
    >
      <div
        className={
          BG_COLOR_M7 + " fixed flex h-8 w-full items-center justify-center"
        }
      >
        <h1 className="text-lg font-bold text-white">Hyperfit</h1>
      </div>

      <div className="flex h-full w-full pt-8">
        <div className={BG_COLOR_M6 + " flex h-full w-2/12 flex-col"}></div>

        <div
          id="edit-modal"
          className="relative flex h-full w-10/12 items-center justify-center"
        >
          <PageContent />
        </div>
      </div>
    </div>
  );
};

export default Home;
