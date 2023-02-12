import type { NextPage } from "next";
import { useEffect } from "react";

import { Home } from "@/components/home";
import { useAuth } from "@/utils/store/auth";

const HomePage: NextPage = () => {
  const { setJWE } = useAuth();

  useEffect(() => {
    setJWE(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Home />;
};

export default HomePage;
