import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import type {
  CustomFieldTypes,
  FieldClassnames,
} from "@/utils/types/shared.types";
import type { AdminOrg } from "@/utils/types/admin.types";
import { CreateYupSchema } from "@/utils/functions";
import { AdminLogin, AdminOrgs, OrgApprove } from "@/utils/services/api";
import { Button, CustomField, Message } from "@/components/shared";

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
          setOrgs(await AdminOrgs(authenticated));
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [authenticated]);

  const submitHandler = useCallback(
    async (values: { admin_email: ""; admin_password: "" }) => {
      try {
        setAuthenticated(await AdminLogin(values));
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
        console.log(id);

        const did = await OrgApprove(id, authenticated!);

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
    <Message>
      {!authenticated ? (
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
                  Welcome
                </h3>

                <p className="text-onyx text-opacity-75">
                  Please fill out the following details
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
      ) : (
        <div>
          {!orgs ? (
            <div>loading</div>
          ) : (
            <div>
              {orgs.map((org) => (
                <article key={org.did}>
                  <h5>{org.name}</h5>

                  {!org.did && (
                    <button
                      type="button"
                      onClick={() => approveHandler(org.id)}
                    >
                      Approve
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </Message>
  );
};

export default Admin;
