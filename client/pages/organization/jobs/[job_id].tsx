import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import type { OrganizationJobApplicantProps } from "@/utils/types/organization.types";
import { OrganizationJobApplicants } from "@/components/organization/applicants";
import { FetchOrgJobApplicants } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";

const OrganizationApplicationsPage: NextPage = () => {
  const [applicants, setApplicants] = useState<
    OrganizationJobApplicantProps[] | null
  >(null);

  const { JWE } = useAuth();

  const { replace, query } = useRouter();

  useEffect(() => {
    if (!JWE) replace("/404");
    else
      (async () => {
        try {
          setApplicants(await FetchOrgJobApplicants(JWE!, query.job_id));
        } catch (error) {
          console.error(error);
        } finally {
        }
      })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      {!applicants ? (
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            height={160}
            width={160}
            alt="deLinZK | profile loader"
            src="/page-loader.gif"
            unoptimized
          />

          <p className="font-bold mt-8 text-2xl">Fetching Jobs...</p>
        </div>
      ) : (
        <OrganizationJobApplicants applicants={applicants} />
      )}
    </>
  );
};

export default OrganizationApplicationsPage;
