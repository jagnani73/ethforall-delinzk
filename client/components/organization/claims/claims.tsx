import { useCallback, useMemo } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import type { FieldClassnames } from "@/utils/types/shared.types";
import type { ClaimSchema } from "@/utils/types/organization.types";
import { Button, CustomField, Message } from "@/components/shared";
import {
  CreateYupSchema,
  DatesToTenure,
  PopPromiseToast,
} from "@/utils/functions";
import { OrgCreateClaim } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";

const OrganizationClaims: React.FC = () => {
  const { JWE } = useAuth();

  const CLASSNAMES = useMemo<FieldClassnames>(
    () => ({
      wrapper: "w-full first:mb-10",
      input:
        "rounded p-4 w-full bg-onyx bg-opacity-5 border-2 border-slate-blue border-opacity-50 focus:border-opacity-100 transition-all outline-none",
      description: "text-red-400 text-sm font-medium mt-0.5 pl-1",
      label: "text-left mr-auto block",
    }),
    []
  );

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
            label: "Employee email to send claim offer to",
            placeholder: "gita@hashlabs.dev",
            classnames: CLASSNAMES,
          },
          {
            name: "employee_start_date",
            id: "employee_start_date",
            type: "date",
            label: "Start Date",
            description: "Start date",
            classnames: CLASSNAMES,
          },
          {
            name: "employee_end_date",
            id: "employee_end_date",
            type: "date",
            label: "End Date",
            description: "End date",
            classnames: CLASSNAMES,
          },
        ],
      },
    ],
    [CLASSNAMES]
  );

  const submitHandler = useCallback(
    async (values: Record<string, any>, resetForm: () => void) => {
      try {
        const employee_tenure: number = DatesToTenure(
          values["employee_start_date"],
          values["employee_end_date"] ?? null
        );

        const claimPromise = OrgCreateClaim(
          JWE!,
          employee_tenure,
          values["employee_email"]
        );
        PopPromiseToast(
          claimPromise,
          "creating claim up...",
          "claim created",
          "please try again"
        );
        await claimPromise;
        resetForm();
      } catch (error) {
        console.error(error);
      }
    },
    [JWE]
  );

  return (
    <Message>
      {CLAIMS.map(({ fields, name, description }) => (
        <article key={name}>
          <Formik
            enableReinitialize
            onSubmit={(values, { resetForm }) =>
              submitHandler(values, resetForm)
            }
            initialValues={{
              employee_email: "",
              employee_start_date: "",
              employee_end_date: "",
            }}
            validationSchema={Yup.object().shape(
              fields.reduce(CreateYupSchema, {})
            )}
          >
            {({ errors, touched }) => (
              <Form className="w-96 text-center">
                <h2 className="text-4xl font-bold">{name}</h2>

                <p className="text-onyx text-opacity-75 font-medium my-4">
                  {description}
                </p>

                <div className="flex flex-col gap-y-2 w-full mt-2">
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

                <Button primary type="submit" className="mt-8 px-10">
                  Offer Claim
                </Button>
              </Form>
            )}
          </Formik>
        </article>
      ))}
    </Message>
  );
};

export default OrganizationClaims;
