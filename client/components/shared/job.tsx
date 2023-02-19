import type { JobProps } from "@/utils/types/shared.types";
import { useCallback } from "react";

import { Button, Message, OrgDetails } from "@/components/shared";
import { IndustryIcon } from "@/public/icons";
import { EmpJobApply } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";
import { PopPromiseToast } from "@/utils/functions";

const Job: React.FC<JobProps> = ({
  job: { description, name, org, id },
  role,
}) => {
  const { JWE } = useAuth();

  const applyHandler = useCallback(async () => {
    try {
      const applyPromise = EmpJobApply(JWE!, id);
      PopPromiseToast(
        applyPromise,
        "applying...",
        "applied",
        "please try again"
      );
      await applyPromise;
    } catch (error) {
      console.error(error);
    } finally {
    }
  }, [JWE, id]);

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
            onClick={applyHandler}
          >
            Apply
          </Button>
        )}
      </article>
    </Message>
  );
};

export default Job;
