import SavedTrainingBlocks from "./SavedTrainingBlocks/SavedTrainingBlocks";

export default function Workout() {
  return (
    <div className="flex h-full flex-col pt-10">
      <h1 className="mb-5 text-white">Workout</h1>
      <div className="flex h-full flex-col space-x-5 space-y-5">
        <SavedTrainingBlocks />
      </div>
    </div>
  );
}
