import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import type { EmployeeType } from "@/utils/types/employee.types";
import { Profile } from "@/components/shared";
import { useAuth } from "@/utils/store/auth";
import { EmpProfile } from "@/utils/services/api";

const EmployeeProfilePage: NextPage = () => {
  const [employee, setEmployee] = useState<EmployeeType | null>(null);
  const { replace } = useRouter();
  const { JWE } = useAuth();

  useEffect(() => {
    if (!JWE) replace("/404");
    else
      (async () => {
        try {
          setEmployee(await EmpProfile(JWE!));
        } catch (error) {
          console.error(error);
        } finally {
        }
      })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JWE]);

  return (
    <>
      {!employee ? (
        <div>loading</div>
      ) : (
        <Profile employee={employee} publicProfile={false} />
      )}
    </>
  );
};

export default EmployeeProfilePage;
