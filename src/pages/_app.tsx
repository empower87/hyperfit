import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import Layout from "~/components/Layout/Layout";
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

export default api.withTRPC(MyApp);
