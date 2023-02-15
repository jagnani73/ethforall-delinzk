/* eslint-disable @next/next/no-img-element */

import { useCallback } from "react";
import { Formik } from "formik";

import type { ProfileProps } from "@/utils/types/shared.types";
import { EditIcon, EmailIcon, IndustryIcon } from "@/public/icons";
import { CustomField, Message, OrgDetails } from ".";
import { EmpProfileUpdate } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";

const Profile: React.FC<ProfileProps> = ({ employee, publicProfile }) => {
  const { JWE } = useAuth();

  const submitHandler = useCallback(
    async (values: Record<string, any>) => {
      try {
        const data = new FormData();
        Object.entries(values).map(([key, value]: [string, string | File]) => {
          data.append(key, value);
        });

        await EmpProfileUpdate(JWE!, data);
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    [JWE]
  );

  return (
    <Formik
      enableReinitialize
      onSubmit={submitHandler}
      initialValues={{
        emp_name: employee?.name,
        emp_about: employee?.about,
        emp_username: employee?.username,
        emp_industry: employee?.industry,
        emp_email: employee?.email,
      }}
    >
      <Message className="flex w-9/12 max-w-7xl pl-0 pb-0">
        <main className="w-full h-full">
          <h2 className="flex items-center my-8 mb-12 text-4xl font-bold ml-8">
            {!publicProfile && (
              <span className="flex w-8 h-8 mr-4">
                <EditIcon />
              </span>
            )}
            Profile
          </h2>

          <div className="flex h-full items-start w-full">
            <div className="flex items-center text-center flex-col w-1/4 h-full bg-pale-purple pt-8">
              <img
                src={employee.photo}
                alt={`${employee.username} on deLinZK`}
                className="w-40 mx-auto rounded-full"
              />
              {publicProfile ? (
                <h6 className="text-2xl font-bold p-8 pb-0">{employee.name}</h6>
              ) : (
                <CustomField
                  id="emp_name"
                  name="emp_name"
                  type="text"
                  classnames={{
                    input:
                      "outline-none bg-transparent text-center text-2xl font-bold p-8 pb-0",
                  }}
                />
              )}

              {publicProfile ? (
                <p className="mb-8 font-medium text-xl">@{employee.username}</p>
              ) : (
                <CustomField
                  id="emp_username"
                  name="emp_username"
                  type="text"
                  classnames={{
                    input:
                      "outline-none bg-transparent text-center mb-8 font-medium text-xl",
                  }}
                />
              )}

              <div className="flex flex-col w-full gap-y-4 mb-12 text-left px-6">
                <OrgDetails
                  content={
                    publicProfile ? (
                      employee.industry
                    ) : (
                      <CustomField
                        type="text"
                        id="emp_industry"
                        name="emp_industry"
                        classnames={{
                          input: "bg-transparent outline-none",
                        }}
                      />
                    )
                  }
                  heading="Industry"
                  icon={<IndustryIcon />}
                />

                <OrgDetails
                  content={
                    publicProfile ? (
                      employee.email
                    ) : (
                      <CustomField
                        type="text"
                        id="emp_email"
                        name="emp_email"
                        classnames={{
                          input: "bg-transparent outline-none",
                        }}
                      />
                    )
                  }
                  heading="Email"
                  icon={<EmailIcon />}
                />
              </div>

              <button className="w-full text-white text-lg font-medium bg-slate-blue py-4 mt-auto">
                {publicProfile ? "Share Profile" : "Save Profile"}
              </button>
            </div>

            <div className="w-3/4 text-xl px-12">
              <p className="text-slate-blue mb-2 text-xl">
                Say hello to the hustler
              </p>

              {publicProfile ? (
                <p className="h-60 overflow-y-auto border-dashed border-2 rounded-lg border-slate-blue p-4">
                  {employee.about}
                </p>
              ) : (
                <CustomField
                  id="emp_about"
                  name="emp_about"
                  type="textarea"
                  classnames={{
                    wrapper: "h-60",
                    input:
                      "w-full h-full p-4 transition-all outline-none overflow-visible overflow-y-auto border-dashed border-2 rounded-lg focus:border-solid border-slate-blue",
                  }}
                />
              )}
              <div className="mt-16">
                <p className="text-3xl">Proofs</p>

                <p className="font-light mt-4">no proofs yet</p>
              </div>
            </div>
          </div>
        </main>
      </Message>
    </Formik>
  );
};

export default Profile;
