import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import "@/styles/globals.css";
import { Layout } from "@/components/shared";
import { AuthProvider } from "@/utils/store/auth";

const App = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  const { events } = useRouter();

  useEffect(() => {
    events.on(
      "routeChangeStart",
      (_, { shallow }) => !shallow && setLoading(true)
    );
    events.on("routeChangeComplete", () => setLoading(false));
    events.on("routeChangeError", () => setLoading(false));
    setLoading(false);
  }, [events]);

  return (
    <>
      <Head>
        <title>deLinZK</title>
      </Head>

      {loading && (
        <div className="w-full h-screen z-50 fixed flex items-center justify-center top-0 left-0 bg-transparent backdrop-blur">
          <Image
            height={200}
            width={200}
            alt="deLinZK | page loader"
            src="/page-loader.gif"
          />
        </div>
      )}

      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
};

export default App;
