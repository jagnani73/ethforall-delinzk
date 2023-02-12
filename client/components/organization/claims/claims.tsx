import { useCallback, useMemo } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import type { ClaimSchema } from "@/utils/types/organization.types";
import { Button, CustomField } from "@/components/shared";
import { CreateYupSchema, DatesToTenure } from "@/utils/functions";
import { OrgCreateClaim } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";

const OrganizationClaims: React.FC = () => {
  const { JWE } = useAuth();

  const CLAIMS = useMemo<ClaimSchema[]>(
    () => [
      {
        name: "POE",
        description: "this is POE",
        fields: [
          {
            name: "employee_email",
            id: "employee_email",
            type: "text",
            label: "Email",
            placeholder: "gita@hashlabs.dev",
            description: "Employee email to send claim offer to",
          },
          {
            name: "employee_start_date",
            id: "employee_start_date",
            type: "date",
            label: "Start Date",
            description: "Start date",
          },
          {
            name: "employee_end_date",
            id: "employee_end_date",
            type: "date",
            label: "End Date",
            description: "End date",
          },
        ],
      },
    ],
    []
  );

  const submitHandler = useCallback(
    async (values: Record<string, any>) => {
      const employee_tenure: number = DatesToTenure(
        values["employee_start_date"],
        values["employee_end_date"] ?? null
      );

      await OrgCreateClaim(JWE!, employee_tenure, values["employee_email"]);

      // TODO: resetForm on success toast
    },
    [JWE]
  );

  return (
    <main>
      {CLAIMS.map(({ fields, name, description }) => (
        <article key={name}>
          <Formik
            enableReinitialize
            onSubmit={submitHandler}
            initialValues={{
              employee_email: "gita@hashlabs.dev",
              employee_start_date: "",
              employee_end_date: "",
            }}
            validationSchema={Yup.object().shape(
              fields.reduce(CreateYupSchema, {})
            )}
          >
            {({ errors, touched }) => (
              <Form className="w-96">
                <h4>{name}</h4>

                <p>{description}</p>

                <p>Required Attributes</p>
                <div className="flex flex-col gap-y-2 w-full">
                  {fields.map((field) => (
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

                <Button primary type="submit">
                  Offer Claim
                </Button>
              </Form>
            )}
          </Formik>
        </article>
      ))}
    </main>
  );
};

export default OrganizationClaims;
