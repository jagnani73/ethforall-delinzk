import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";

import type { EmployeeType } from "@/utils/types/employee.types";
import { Profile } from "@/components/shared";
import { useAuth } from "@/utils/store/auth";
import { EmpProfile } from "@/utils/services/api";

const EmployeeProfilePage: NextPage = () => {
  const [employee, setEmployee] = useState<EmployeeType | null>(null);
  const { JWE } = useAuth();

  useEffect(() => {
    if (JWE)
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
        <Profile employee={employee} publicProfile={false} />
      )}
    </>
  );
};

export default EmployeeProfilePage;
