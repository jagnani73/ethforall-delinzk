/* eslint-disable @next/next/no-img-element */

import { useCallback } from "react";
import { Form, Formik } from "formik";

import type { ProfileProps } from "@/utils/types/shared.types";
import { EditIcon, EmailIcon, IndustryIcon } from "@/public/icons";
import { Button, CustomField, Message, OrgDetails } from ".";
import { EmpProfileUpdate } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";

const Profile: React.FC<ProfileProps> = ({ employee, publicProfile }) => {
  const { JWE } = useAuth();

  const submitHandler = useCallback(
    async (values: Record<string, any>) => {
      try {
        await EmpProfileUpdate(JWE!, values);
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    [JWE]
  );

  return (
    <Message className="flex w-9/12 max-w-7xl pl-0 pb-0">
      <Formik
        enableReinitialize
        onSubmit={submitHandler}
        initialValues={{
          employee_name: employee?.name,
          employee_about: employee?.about,
          employee_industry: employee?.industry,
        }}
      >
        {() => (
          <Form className="w-full h-full">
            <h2 className="my-8 mb-12 text-4xl font-bold ml-8">Profile</h2>

            <div className="flex h-full items-start w-full">
              <div className="flex items-center text-center flex-col w-1/4 h-full bg-pale-purple pt-8">
                <img
                  src={employee.photo}
                  alt={`${employee.username} on deLinZK`}
                  className="w-40 mx-auto rounded-full"
                />
                {publicProfile ? (
                  <h6 className="text-2xl font-bold p-8 pb-0">
                    {employee.name}
                  </h6>
                ) : (
                  <CustomField
                    id="employee_name"
                    name="employee_name"
                    type="text"
                    classnames={{
                      wrapper: "relative mt-8",
                      input:
                        "outline-none bg-transparent text-center text-2xl font-bold pb-0 focus:underline max-w-full",
                    }}
                    description={
                      <span className="absolute transform -translate-y-1/2 top-1/2 left-4 w-5 h-5 flex bg-pale-purple">
                        <EditIcon />
                      </span>
                    }
                  />
                )}

                <p className="mb-8 font-medium text-xl">@{employee.username}</p>

                <div className="flex flex-col w-full gap-y-4 mb-12 text-left px-6">
                  <OrgDetails
                    content={
                      publicProfile ? (
                        employee.industry
                      ) : (
                        <CustomField
                          type="text"
                          id="employee_industry"
                          name="employee_industry"
                          classnames={{
                            input: "bg-transparent outline-none",
                          }}
                        />
                      )
                    }
                    heading="Industry"
                    icon={publicProfile ? <IndustryIcon /> : <EditIcon />}
                  />

                  <OrgDetails
                    content={employee.email}
                    heading="Email"
                    icon={<EmailIcon />}
                  />
                </div>

                <Button
                  primary
                  className="w-full text-lg py-4 mt-auto rounded-none"
                  type={publicProfile ? "button" : "submit"}
                >
                  {publicProfile ? "Share Profile" : "Save Profile"}
                </Button>
              </div>

              <div className="w-3/4 text-xl px-12">
                <p className="flex items-center gap-x-4 text-slate-blue mb-2 text-xl">
                  {publicProfile ? (
                    "The hustler says hi 👋"
                  ) : (
                    <>
                      <span className="w-5 h-5 flex">
                        <EditIcon />
                      </span>
                      Edit your bio
                    </>
                  )}
                </p>

                {publicProfile ? (
                  <p className="h-60 overflow-y-auto border-dashed border-2 rounded-lg border-slate-blue p-4">
                    {employee.about}
                  </p>
                ) : (
                  <CustomField
                    id="employee_about"
                    name="employee_about"
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
          </Form>
        )}
      </Formik>
    </Message>
  );
};

export default Profile;
