import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import Head from "next/head";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <DndProvider backend={HTML5Backend}>

      <Head>
        <title>HyperFit</title>
        <meta
          name="description"
          content="Hypertrophy focused workout generator"
          />
      </Head>
      <Component {...pageProps} />
      </DndProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
