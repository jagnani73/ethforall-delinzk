/* eslint-disable @next/next/no-img-element */

import type { ProfileProps } from "@/utils/types/shared.types";
import { EmailIcon, IndustryIcon } from "@/public/icons";
import { Message, OrgDetails } from ".";

const Profile: React.FC<ProfileProps> = ({ employee, publicProfile }) => {
  return (
    <Message className="flex w-9/12 max-w-7xl pl-0 pb-0">
      <main className="w-full h-full">
        <h2 className="my-8 mb-12 text-4xl font-bold ml-8">Profile</h2>

        <div className="flex h-full items-start w-full">
          <div className="flex items-center text-center flex-col w-1/4 h-full bg-pale-purple pt-8">
            <img
              src={employee.photo}
              alt={`${employee.username} on deLinZK`}
              className="w-40 mx-auto rounded-full"
            />
            <h6 className="text-2xl font-bold p-8 pb-0">{employee.name}</h6>

            <p className="mb-8 font-medium text-xl">@{employee.username}</p>

            <div className="flex flex-col w-full gap-y-4 mb-12 text-left px-6">
              <OrgDetails
                content={employee.industry}
                heading="Industry"
                icon={<IndustryIcon />}
              />

              <OrgDetails
                content={employee.email}
                heading="Email"
                icon={<EmailIcon />}
              />
            </div>

            <button className="w-full text-white text-xl font-medium bg-slate-blue py-4 mt-auto">
              Share Profile
            </button>
          </div>

          <div className="w-3/4 text-xl px-12">
            <p className="h-60 overflow-y-auto border-dashed border-2 rounded-lg border-slate-blue p-4">
              {employee.about}
            </p>

            <div className="mt-16">
              <p className="text-3xl">Proofs</p>

              <p className="font-light mt-4">no proofs yet</p>
            </div>
          </div>
        </div>
      </main>
    </Message>
  );
};

export default Profile;
