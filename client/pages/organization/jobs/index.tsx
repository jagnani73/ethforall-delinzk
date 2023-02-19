import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";

import type { JobProps } from "@/utils/types/shared.types";
import { Jobs } from "@/components/shared";
import { FetchOrgJobs } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";

const OrganizationJobsPage: NextPage = () => {
  const [jobs, setJobs] = useState<JobProps[] | null>(null);

  const { JWE } = useAuth();

  useEffect(() => {
    if (JWE)
      (async () => {
        try {
          setJobs(await FetchOrgJobs(JWE!));
        } catch (error) {
          console.error(error);
        } finally {
        }
      })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!jobs ? (
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
        <Jobs jobs={jobs} role={"organization"} />
      )}
    </>
  );
};

export default OrganizationJobsPage;
