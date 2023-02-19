import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/utils/store/auth";

const Authorization: React.FC = () => {
  const { asPath, replace } = useRouter();

  const { JWE } = useAuth();

  const AUTHORIZED_ROUTES = useMemo<string[]>(
    () => [
      "/employee/profile",
      "/organization/claims",
      "/organization/jobs",
      "/organization/jobs/create",
    ],
    []
  );

  useEffect(() => {
    if (AUTHORIZED_ROUTES.includes(asPath) && !JWE) replace("/404");
  }, [AUTHORIZED_ROUTES, JWE, asPath, replace]);

  return <></>;
};

export default Authorization;
