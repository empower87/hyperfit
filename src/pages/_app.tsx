import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import Navbar from "~/components/Navbar";
import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>HyperFit</title>
        <meta
          name="description"
          content="Hypertrophy focused workout generator"
        />
      </Head>

      <TrainingProgramProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TrainingProgramProvider>
    </SessionProvider>
  );
};

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar>
        <Navbar.Sidebar contents={<Link href="/programConfig">Program</Link>} />
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
    <div className="h-screen w-full overflow-hidden bg-primary-800 pl-24 pr-6 pt-12">
      {children}
    </div>
  );
}

function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="h-full max-w-[1350px] md:mx-auto lg:p-0">{children}</div>
  );
}

export default api.withTRPC(MyApp);
