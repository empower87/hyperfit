import { ReactNode } from "react";
import { ActionCard, Actions, Days } from "./Contents";

const TEST_DATA = {
  id: "back-002",
  muscle: "back",
  exercises: [[], [], [], []],
  volume: {
    landmark: "MRV",
    exercisesPerSessionSchema: 2,
  },
  frequency: {
    range: [3, 4],
    target: 0,
    progression: [2, 3, 4],
    setProgressionMatrix: [[], [], []],
  },
};

type MusclePopoutProps = {
  children: ReactNode;
};

MusclePopout.Header = Header;
MusclePopout.Footer = Footer;
MusclePopout.Contents = Contents;
export default function MusclePopout({ children }: MusclePopoutProps) {
  return (
    <div className=" flex w-[1200px] flex-col bg-primary-600">{children}</div>
  );
}

type HeaderProps = {
  children: ReactNode;
};
function Header({ children }: HeaderProps) {
  return (
    <div className="flex justify-between bg-primary-700 p-1">
      <div className="text-m indent-1 font-semibold text-white">
        Edit Muscle
      </div>
      {children}
    </div>
  );
}

type FooterProps = {
  children: ReactNode;
};
function Footer({ children }: FooterProps) {
  return <div className="p-1">{children}</div>;
}

type ContentsPlaceholderProps = {
  children: ReactNode;
};

const EXERCISES = TEST_DATA.exercises;
function Contents() {
  return (
    <div className="flex flex-col p-2">
      <ContentsPlaceholder>
        <Actions>
          <ActionCard title="Frequency">
            <div>1</div>
            <div>2</div>
            <div>3</div>
          </ActionCard>
        </Actions>
        <Days days={EXERCISES} />
      </ContentsPlaceholder>
    </div>
  );
}

function ContentsPlaceholder({ children }: ContentsPlaceholderProps) {
  return <div className="flex flex-col space-y-2">{children}</div>;
}
