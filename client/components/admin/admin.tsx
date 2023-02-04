import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { CreateYupSchema } from "@/utils/functions";
import { AdminLogin, AdminOrgs, OrgApprove } from "@/utils/services/api";
import { CustomField } from "@/components/shared";
import type { CustomFieldTypes } from "@/utils/types/shared.types";
import type { AdminOrg } from "@/utils/types/admin.types";

const Admin: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<string | null>(null);
  const [orgs, setOrgs] = useState<AdminOrg[] | null>(null);

  const FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "admin_email",
        name: "admin_email",
        type: "text",
        placeholder: "Email",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
      },
      {
        id: "admin_password",
        name: "admin_password",
        type: "password",
        placeholder: "Password",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
      },
      {
        id: "admin_secret",
        name: "admin_secret",
        type: "password",
        placeholder: "Secret",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
      },
    ],
    []
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
    async (values: { email: string; password: string; secret: string }) => {
      try {
        console.log(values);

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
    <main>
      {!authenticated ? (
        <Formik
          enableReinitialize
          onSubmit={submitHandler}
          initialValues={{ email: "", password: "", secret: "" }}
          validationSchema={Yup.object().shape(
            FIELDS.reduce(CreateYupSchema, {})
          )}
        >
          {({ errors, touched }) => (
            <Form>
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

              <button type="submit">Login</button>
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
    </main>
  );
};

export default Admin;
