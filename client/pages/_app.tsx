import type { AppProps } from "next/app";
import Head from "next/head";

import "@/styles/globals.css";
import { Layout } from "@/components/shared";
import { AuthProvider } from "@/utils/store/auth";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>deLinZK</title>
      </Head>

      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
};

export default App;
