import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";

import type { EmployeeApplicationProps } from "@/utils/types/employee.types";
import { EmployeeApplications } from "@/components/employee/applications";
import { useAuth } from "@/utils/store/auth";
import { EmpApplications } from "@/utils/services/api";

const EmployeeApplicationsPage: NextPage = () => {
  const [applications, setApplications] = useState<
    EmployeeApplicationProps[] | null
  >(null);

  const { JWE } = useAuth();

  useEffect(() => {
    if (JWE)
      (async () => {
        try {
          setApplications(await EmpApplications(JWE!));
        } catch (error) {
          console.error(error);
        } finally {
        }
      })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JWE]);

  return (
    <>
      {!applications ? (
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            height={160}
            width={160}
            alt="deLinZK | profile loader"
            src="/page-loader.gif"
            unoptimized
          />

          <p className="font-bold mt-8 text-2xl">
            Cooking up 👨‍🍳 your profile...
          </p>
        </div>
      ) : (
        <EmployeeApplications applications={applications} />
      )}
    </>
  );
};

export default EmployeeApplicationsPage;
