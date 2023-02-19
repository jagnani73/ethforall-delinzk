import type { JobProps } from "@/utils/types/shared.types";

import { Message, OrgDetails } from "@/components/shared";
import { IndustryIcon } from "@/public/icons";

const Job: React.FC<JobProps> = ({ description, name, org }) => {
  return (
    <Message className="min-w-xl mt-0">
      <article className="w-full">
        <h4 className="font-bold text-3xl">{name}</h4>
        <p className="mt-4 text-onyx text-opacity-75">{description}</p>

        <div className="flex flex-col w-full gap-y-6 mt-8">
          <OrgDetails
            content={org.name}
            heading="Organization"
            icon={<IndustryIcon />}
          />
        </div>
      </article>
    </Message>
  );
};

export default Job;
