import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { EmployeeProfile } from "@/components/employee/profile";
import { useAuth } from "@/utils/store/auth";

const EmployeeProfilePage: NextPage = () => {
  const { replace } = useRouter();

  const { JWE } = useAuth();

  useEffect(() => {
    if (!JWE) replace("/404");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JWE]);

  return <EmployeeProfile />;
};

export default EmployeeProfilePage;
