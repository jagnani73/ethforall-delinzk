import type { JobsProps } from "@/utils/types/shared.types";

import { Message, OrgDetails } from "@/components/shared";
import { IndustryIcon } from "@/public/icons";

const Jobs: React.FC<JobsProps> = ({ jobs, role }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="mt-12 text-4xl font-bold ml-8">
        Approval Pending Organizations
      </h2>

      <div className="flex h-fit gap-x-16 m-auto w-full overflow-x-auto p-8">
        {jobs.length ? (
          jobs.map(({ description, name, orgName, id }) => (
            <Message key={id} className="min-w-xl mt-0">
              <article className="w-full">
                <h4 className="font-bold text-3xl">{name}</h4>
                <p className="mt-4 text-onyx text-opacity-75">{description}</p>

                <div className="flex flex-col w-full gap-y-6 mt-8">
                  <OrgDetails
                    content={orgName}
                    heading="Organization"
                    icon={<IndustryIcon />}
                  />
                </div>
              </article>
            </Message>
          ))
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
