import { ReactNode, useCallback, useMemo, useState } from "react";
import { AddIcon, PlusIcon, SubtractIcon } from "~/assets/icons/_icons";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
import { getMuscleData } from "~/utils/getMuscleData";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
import CollapsibleHeader from "../Layout/CollapsibleHeader";
import Counter from "./components/Counter";
import SideMenu from "./components/SideMenu";
import {
  MuscleEditorProvider,
  useMuscleEditorContext,
} from "./context/MuscleEditorContext";
import TrainingDays from "./components/TrainingDay";

export default function MuscleEditor() {
  const { prioritized_muscle_list } = useTrainingProgramContext();

  const list = useMemo(
    () => prioritized_muscle_list.map((each) => structuredClone(each)),
    [prioritized_muscle_list]
  );

  return (
    <ul className={`space-y-2 scroll-smooth`}>
      {list.map((each, index) => {
        return (
          <MuscleEditorProvider
            key={`${each.id}_${index}_MuscleEditorProvider`}
            muscle={each}
          >
            <MuscleItem order={index + 1} />
          </MuscleEditorProvider>
        );
      })}
    </ul>
  );
}

type MuscleProps = {
  order: number;
};
function MuscleItem({ order }: MuscleProps) {
  const {
    selectedMesocycleIndex,
    muscleGroup,
    onSelectMesocycle,
    volumes,
    mesocyclesArray,
    onResetMuscleGroup,
    onSaveMuscleGroupChanges,
    onSelectedFrequencyProgressionIncrement,
    onSelectedFrequencyProgressionDecrement,
  } = useMuscleEditorContext();

  const muscle_name = muscleGroup.muscle
  const v_landmark = muscleGroup.volume.landmark
  const freq_progression = muscleGroup.frequency.progression

  const { bg, text} = getRankColor(v_landmark);
  const title = getMuscleTitleForUI(muscle_name);
  const muscleData = getMuscleData(muscle_name);
  const volumeSets =
    v_landmark === "MRV"
      ? muscleData["MRV"][
          freq_progression[
            freq_progression.length - 1
          ] - 1
        ]
      : muscleData[v_landmark];

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSideMenuCollapsed, setIsSideMenuCollapsed] = useState(false);

  const onToggleSideMenu = () => setIsSideMenuCollapsed((prev) => !prev);
  const onExpandHandler = () => setIsCollapsed(false);
  const onCollapseHandler = () => setIsCollapsed(true);

  if (isCollapsed) {
    return (
      <li id={muscle_name}>
        <CollapsibleHeader className={`${bg} rounded`}>
          <CollapsibleHeader.Title label={`${order} ${title}`} />

          <CollapsibleHeader.Button
            isCollapsed={isCollapsed}
            onCollapse={onExpandHandler}
          />
        </CollapsibleHeader>
      </li>
    );
  }
  return (
    <li
      id={muscle_name}
      className={`flex flex-col bg-primary-700 scroll-smooth rounded`}
    >
      <CollapsibleHeader className={`${bg}`}>
        <CollapsibleHeader.Title label={`${order} ${title}`} />

        <CollapsibleHeader.Button
          isCollapsed={isCollapsed}
          onCollapse={onCollapseHandler}
        />
      </CollapsibleHeader>

      <div className={`flex`}>
        <SideMenu
          isCollapsed={isSideMenuCollapsed}
          onCollapse={onToggleSideMenu}
        >
          <SideMenu.Contents>
            <SideMenu.Container alignment="y">
              <SideMenu.Section title="Volume Landmark" alignment="x">
                <div
                  className={`flex items-center justify-center space-x-1 p-0.5`}
                >
                  <div className={`p-0.5 text-xxs font-bold ${text}`}>
                    {v_landmark}
                  </div>
                  <div className={`p-0.5 text-xxs font-bold ${text}`}>
                    {volumeSets}
                  </div>
                </div>
              </SideMenu.Section>

              <SideMenu.ToggleMesocycle
                mesocycles={
                  <div className={`flex justify-center`}>
                    {mesocyclesArray?.map((each, index) => {
                      const isSelected = index === selectedMesocycleIndex;

                      return (
                        <SideMenu.MesocycleCell
                          key={`${each}_ToggleMesocycleMesocycles_${index}`}
                          selectedValue={isSelected}
                          onClick={() => onSelectMesocycle(index)}
                        >
                          {each + 1}
                        </SideMenu.MesocycleCell>
                      );
                    })}
                  </div>
                }
                frequency={
                  <div className={`flex justify-center p-0.5`}>
                    {freq_progression.map((each, index) => {
                      const isSelected = index === selectedMesocycleIndex;
                      return (
                        <SideMenu.Cell
                          key={`${each}_ToggleMesocycleFrequency_${index}`}
                          selectedValue={isSelected}
                        >
                          <Counter>
                            <Counter.Button
                              onClick={() =>
                                onSelectedFrequencyProgressionDecrement(index)
                              }
                            >
                              <SubtractIcon fill="white" />
                            </Counter.Button>

                            <Counter.Value value={each} />

                            <Counter.Button
                              onClick={() =>
                                onSelectedFrequencyProgressionIncrement(index)
                              }
                            >
                              <AddIcon fill="white" />
                            </Counter.Button>
                          </Counter>
                        </SideMenu.Cell>
                      );
                    })}
                  </div>
                }
                volume={
                  <div className={`flex justify-center p-0.5`}>
                    {volumes.map((each, index) => {
                      const isSelected = index === selectedMesocycleIndex;
                      return (
                        <SideMenu.Cell
                          key={`${each}_ToggleMesocycleVolume_${index}`}
                          selectedValue={isSelected}
                        >
                          {each}
                        </SideMenu.Cell>
                      );
                    })}
                  </div>
                }
              />
            </SideMenu.Container>

            <SideMenu.Container alignment="x">
              <SideMenu.Button label="Reset" onClick={onResetMuscleGroup} />
              <SideMenu.Button
                label="Save Changes"
                onClick={onSaveMuscleGroupChanges}
              />
            </SideMenu.Container>
          </SideMenu.Contents>
        </SideMenu>
        
        <TrainingDays />
      </div>
    </li>
  );
}
