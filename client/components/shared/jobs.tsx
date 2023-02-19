import type { JobsProps } from "@/utils/types/shared.types";
import Link from "next/link";

import { Job, Message } from "@/components/shared";

const Jobs: React.FC<JobsProps> = ({ jobs, role }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="mt-12 text-4xl font-bold ml-8">Listed Jobs</h2>

      <div className="flex h-fit gap-x-16 m-auto w-full overflow-x-auto p-8">
        {jobs.length ? (
          jobs.map((job) =>
            role === "organization" ? (
              <Link key={job.id} href={`organization/jobs/${job.id}`}>
                <Job {...job} />
              </Link>
            ) : (
              <Job key={job.id} {...job} />
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
