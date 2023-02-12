import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/utils/store/auth";
import { OrganizationClaims } from "@/components/organization/claims";

const ClaimsPage: NextPage = () => {
  const { replace } = useRouter();

  const { JWE } = useAuth();

  useEffect(() => {
    if (!JWE) replace("/404");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JWE]);

  return <OrganizationClaims />;
};

export default ClaimsPage;
