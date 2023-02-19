import { useCallback, useState } from "react";
import Link from "next/link";

import type { JobsProps, JobType } from "@/utils/types/shared.types";
import { Job, Message } from "@/components/shared";
import { EmpJobApply } from "@/utils/services/api";
import { PopPromiseToast } from "@/utils/functions";
import { useAuth } from "@/utils/store/auth";

const Jobs: React.FC<JobsProps> = ({ jobs: initialJobs, role }) => {
  const [jobs, setJobs] = useState<JobType[]>(initialJobs);
  const { JWE } = useAuth();

  const applyHandler = useCallback(
    async (id: number) => {
      try {
        const applyPromise = EmpJobApply(JWE!, id);
        PopPromiseToast(
          applyPromise,
          "applying...",
          "applied",
          "please try again"
        );
        await applyPromise;
        setJobs((prevState) => prevState.filter(({ id: _id }) => id !== id));
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    [JWE]
  );

  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="mt-12 text-4xl font-bold ml-8">Listed Jobs</h2>

      <div className="flex h-fit gap-x-16 m-auto w-full overflow-x-auto p-8">
        {jobs.length ? (
          jobs.map((job) =>
            role === "organization" ? (
              <Link key={job.id} href={`/organization/jobs/${job.id}`}>
                <Job job={job} role={role} />
              </Link>
            ) : (
              <Job
                key={job.id}
                job={job}
                role={role}
                handleApply={applyHandler}
              />
            )
          )
        ) : (
          <Message>
            <p className="text-2xl">No jobs listed</p>
          </Message>
        )}
      </div>
    </div>
  );
};

export default Jobs;
