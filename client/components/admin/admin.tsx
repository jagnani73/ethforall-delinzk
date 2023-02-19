import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import type {
  CustomFieldTypes,
  FieldClassnames,
} from "@/utils/types/shared.types";
import type { AdminOrg } from "@/utils/types/admin.types";
import { CreateYupSchema, PopPromiseToast } from "@/utils/functions";
import { AdminLogin, AdminOrgs, OrgApprove } from "@/utils/services/api";
import { Button, CustomField, Message, OrgDetails } from "@/components/shared";
import {
  EmailIcon,
  IndustryIcon,
  LicenseIcon,
  TaglineIcon,
  TeamIcon,
} from "@/public/icons";

const Admin: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<string | null>(null);
  const [orgs, setOrgs] = useState<AdminOrg[] | null>(null);

  const CLASSNAMES = useMemo<FieldClassnames>(
    () => ({
      wrapper: "w-full",
      input:
        "rounded p-4 w-full bg-onyx bg-opacity-5 border-2 border-slate-blue border-opacity-50 focus:border-opacity-100 transition-all outline-none",
      description: "text-red-400 text-sm font-medium mt-0.5 pl-1",
    }),
    []
  );

  const FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "admin_email",
        name: "admin_email",
        type: "text",
        placeholder: "Enter the email address",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
        classnames: CLASSNAMES,
      },
      {
        id: "admin_password",
        name: "admin_password",
        type: "password",
        placeholder: "Enter the password",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
        classnames: CLASSNAMES,
      },
    ],
    [CLASSNAMES]
  );

  useEffect(() => {
    if (authenticated) {
      (async () => {
        try {
          const orgsPromise = AdminOrgs(authenticated);
          PopPromiseToast(
            orgsPromise,
            "loading organizations...",
            "organizations loaded",
            "please try again"
          );
          setOrgs(await orgsPromise);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [authenticated]);

  const submitHandler = useCallback(
    async (values: { admin_email: ""; admin_password: "" }) => {
      try {
        const submitPromise = AdminLogin(values);
        PopPromiseToast(
          submitPromise,
          "signing in...",
          "welcome admin",
          "please try again"
        );
        setAuthenticated(await submitPromise);
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    []
  );

  const approveHandler = useCallback(
    async (id: string) => {
      try {
        const approvalPromise = OrgApprove(id, authenticated!);
        PopPromiseToast(
          approvalPromise,
          "approving organization...",
          "organization approved",
          "please try again"
        );
        const did = await approvalPromise;
        setOrgs((prevState) =>
          prevState!.map((org) => (org.id === id ? { ...org, did } : org))
        );
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    [authenticated]
  );

  return (
    <>
      {!authenticated ? (
        <Message>
          <Formik
            enableReinitialize
            onSubmit={submitHandler}
            initialValues={{ admin_email: "", admin_password: "" }}
            validationSchema={Yup.object().shape(
              FIELDS.reduce(CreateYupSchema, {})
            )}
          >
            {({ errors, touched }) => (
              <Form className="w-96">
                <div className="text-center mb-8">
                  <h3 className="font-medium text-4xl text-center mb-4">
                    Welcome Admin
                  </h3>

                  <p className="text-onyx text-opacity-75">
                    We need to verify you, even if you are one of us
                  </p>
                </div>

                <div className="flex flex-col gap-y-2 w-full">
                  {FIELDS.map((field) => (
                    <CustomField
                      key={field.name}
                      {...field}
                      description={
                        // @ts-ignore
                        touched[field.name] && errors[field.name]
                          ? // @ts-ignore
                            errors[field.name] ?? null
                          : null
                      }
                    />
                  ))}
                </div>

                <Button primary type="submit" className="w-full mt-6">
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Message>
      ) : (
        orgs && (
          <div className="flex flex-col w-full h-full">
            <h2 className="mt-12 text-4xl font-bold ml-8">
              Approval Pending Organizations
            </h2>
            <div className="flex h-fit gap-x-16 m-auto mt-12 w-full overflow-x-auto p-8">
              {orgs.length ? (
                orgs.map(
                  ({
                    did,
                    email,
                    id,
                    industry,
                    license,
                    name,
                    size,
                    tagline,
                  }) => (
                    <Message key={did} className="min-w-xl">
                      <article className="w-full">
                        <h4 className="font-bold text-3xl">{name}</h4>

                        <div className="flex flex-col w-full gap-y-6 mt-8">
                          <OrgDetails
                            content={industry}
                            heading="Industry"
                            icon={<IndustryIcon />}
                          />
                          <OrgDetails
                            content={size}
                            heading="Team Size"
                            icon={<TeamIcon />}
                          />
                          <OrgDetails
                            content={tagline}
                            heading="Tagline"
                            icon={<TaglineIcon />}
                          />
                          <OrgDetails
                            content={email}
                            heading="Email"
                            icon={<EmailIcon />}
                          />

                          <div>
                            <a
                              href={license}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex gap-x-2 items-start text-lg text-slate-blue font-medium underline"
                            >
                              <span className="w-7 h-7 flex">
                                <LicenseIcon />
                              </span>
                              Open License
                            </a>
                          </div>
                        </div>

                        {!did && (
                          <Button
                            primary
                            onClick={() => approveHandler(id)}
                            className="px-12 mx-auto flex mt-8"
                          >
                            Approve
                          </Button>
                        )}
                      </article>
                    </Message>
                  )
                )
              ) : (
                <Message>
                  <p className="text-2xl">No organizations listed</p>
                </Message>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Admin;
