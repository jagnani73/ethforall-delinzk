import type { AppProps } from "next/app";

import "@/styles/globals.css";
import { Layout } from "@/components/shared";
import { AuthProvider } from "@/utils/store/auth";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
};

export default App;
