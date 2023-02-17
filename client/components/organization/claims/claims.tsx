import { useCallback, useMemo } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import type {
  CustomFieldTypes,
  FieldClassnames,
} from "@/utils/types/shared.types";
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
      wrapper: "w-full",
      input:
        "rounded p-4 w-full bg-onyx bg-opacity-5 border-2 border-slate-blue border-opacity-50 focus:border-opacity-100 transition-all outline-none",
      description: "text-red-400 text-sm font-medium mt-0.5 pl-1",
      label: "text-left mr-auto block text-opacity-75 text-onyx font-medium",
    }),
    []
  );

  const INPUT_FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        name: "employee_email",
        id: "employee_email",
        type: "text",
        label: "Employee email to send claim offer",
        placeholder: "gita@hashlabs.dev",
        classnames: CLASSNAMES,
      },
    ],

    [CLASSNAMES]
  );

  const CLAIM_FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        name: "employee_start_date",
        id: "employee_start_date",
        type: "date",
        label: "Start date of employee tenure",
        description: "Start date",
        classnames: CLASSNAMES,
      },
      {
        name: "employee_end_date",
        id: "employee_end_date",
        type: "date",
        label: "End date of employee tenure (if applicable)",
        description: "End date",
        classnames: CLASSNAMES,
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
          "creating claim offer...",
          "claim offer created",
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
      <article>
        <Formik
          enableReinitialize
          onSubmit={(values, { resetForm }) => submitHandler(values, resetForm)}
          initialValues={{
            employee_email: "",
            employee_start_date: "",
            employee_end_date: "",
          }}
          validationSchema={Yup.object().shape(
            [...INPUT_FIELDS, ...CLAIM_FIELDS].reduce(CreateYupSchema, {})
          )}
        >
          {({ errors, touched }) => (
            <Form className="w-96">
              <h2 className="text-4xl font-bold">
                Generate Proof-of-Employment 🛠️
              </h2>

              <p className="text-onyx text-opacity-75 my-4">
                Give your employee an acclaim for being a part of your
                organization
              </p>

              <div className="flex flex-col gap-y-2 w-full mt-2">
                {INPUT_FIELDS.map((field) => (
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

                <h4 className="font-semibold text-2xl mt-6 mb-2">Tenure</h4>

                {CLAIM_FIELDS.map((field) => (
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

              <Button primary type="submit" className="mt-8 px-10 mx-auto flex">
                Send Claim Offer 📩
              </Button>
            </Form>
          )}
        </Formik>
      </article>
    </Message>
  );
};

export default OrganizationClaims;
