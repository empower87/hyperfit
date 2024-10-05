import Link from "next/link";
import { ReactNode } from "react";
import Navbar from "../Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar>
        <Navbar.Sidebar
          contents={<Link href="/programConfig">Configure Program</Link>}
        />
        <Navbar.Topbar />
      </Navbar>

      <HomeWrapper>
        <PageContainer>{children}</PageContainer>
      </HomeWrapper>
    </>
  );
}

function HomeWrapper({ children }: { children: ReactNode }) {
  return (
    <div className=" h-screen w-full bg-primary-800 pl-24 pr-6">{children}</div>
  );
}

function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mb-20 mt-6 max-w-[1350px] md:mx-auto lg:p-0">
      {children}
    </div>
  );
}

function PageSection({ children }: { children: ReactNode }) {
  return <section className="w-full">{children}</section>;
}
