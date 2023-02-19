import type { JobProps } from "@/utils/types/shared.types";

import { Button, Message, OrgDetails } from "@/components/shared";
import { IndustryIcon } from "@/public/icons";

const Job: React.FC<JobProps> = ({
  job: { description, name, org, id },
  role,
  handleApply,
}) => {
  return (
    <Message className="min-w-xl mt-0">
      <article className="w-full">
        <h4 className="font-bold text-3xl">{name}</h4>
        <p className="mt-4 text-onyx text-opacity-75">{description}</p>

        <div className="mt-8">
          <OrgDetails
            content={org.name}
            heading="Organization"
            icon={<IndustryIcon />}
          />
        </div>

        {role === "employee" && (
          <Button
            primary
            className="mx-auto flex px-6 mt-4"
            onClick={() => handleApply!(id)}
          >
            Apply
          </Button>
        )}
      </article>
    </Message>
  );
};

export default Job;
