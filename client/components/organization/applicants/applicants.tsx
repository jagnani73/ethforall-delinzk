import Link from "next/link";

import type { OrganizationJobApplicantsProps } from "@/utils/types/organization.types";
import { Message } from "@/components/shared";

const OrganizationJobApplicants: React.FC<OrganizationJobApplicantsProps> = ({
  applicants,
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="mt-12 text-4xl font-bold ml-8">Applicants</h2>

      <div className="flex h-fit gap-x-16 m-auto w-full overflow-x-auto p-8">
        {applicants.length ? (
          applicants.map(({ id, user: { name, poes, username } }) => (
            <Message
              key={id}
              className="w-fit whitespace-nowrap  px-4 py-2 mb-4"
            >
              <div className="w-40">
                <p className="text-slate-blue text-sm font-medium mt-4">NAME</p>
                <p className="text-lg mb-2">{name}</p>

                <p className="text-slate-blue text-sm font-medium">PROFILE</p>
                <Link
                  className="text-lg underline"
                  href={`/profile/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p>@{username}</p>
                </Link>

                <p className="text-slate-blue text-sm font-medium mt-4">POES</p>
                <p className="text-lg mb-2">{poes.length}</p>
              </div>
            </Message>
          ))
        ) : (
          <Message>
            <p className="text-2xl">No applicants listed</p>
          </Message>
        )}
      </div>
    </div>
  );
};

export default OrganizationJobApplicants;
