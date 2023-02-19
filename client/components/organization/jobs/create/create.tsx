import { useCallback, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button, CustomField, Message } from "@/components/shared";
import { CreateYupSchema, PopPromiseToast } from "@/utils/functions";
import { OrgCreateJob } from "@/utils/services/api";
import { CustomFieldTypes } from "@/utils/types/shared.types";
import { useAuth } from "@/utils/store/auth";

const OrganizationJobsCreate: React.FC = () => {
  const { JWE } = useAuth();

  const FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "name",
        name: "name",
        type: "text",
        placeholder: "Enter the job title",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
        classnames: {
          wrapper: "w-full",
          input:
            "rounded p-4 w-full bg-onyx bg-opacity-5 border-2 border-slate-blue border-opacity-50 focus:border-opacity-100 transition-all outline-none",
          description: "text-red-400 text-sm font-medium mt-0.5 pl-1",
        },
      },
      {
        id: "description",
        name: "description",
        type: "textarea",
        placeholder: "Enter the job description",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
        classnames: {
          wrapper: "w-full h-64",
          input:
            "overflow-y-auto rounded p-4 w-full h-full bg-onyx bg-opacity-5 border-2 border-slate-blue border-opacity-50 focus:border-opacity-100 transition-all outline-none",
          description: "text-red-400 text-sm font-medium mt-0.5 pl-1",
        },
      },
    ],
    []
  );

  const submitHandler = useCallback(
    async (
      values: { name: string; description: string },
      resetForm: () => void
    ) => {
      try {
        const addJobPromise = OrgCreateJob(JWE!, values);
        PopPromiseToast(
          addJobPromise,
          "Creating Job...",
          "Job Created",
          "please try again"
        );
        await addJobPromise;
        resetForm();
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    [JWE]
  );

  return (
    <Message>
      <Formik
        enableReinitialize
        onSubmit={(values, { resetForm }) => submitHandler(values, resetForm)}
        initialValues={{
          description: "",
          name: "",
        }}
        validationSchema={Yup.object().shape(
          FIELDS.reduce(CreateYupSchema, {})
        )}
      >
        {({ errors, touched }) => (
          <Form className="w-96">
            <div className="text-center mb-8">
              <h3 className="font-medium text-4xl text-center mb-4">
                Welcome!
              </h3>

              <p className="text-onyx text-opacity-75">
                We would love to know more about you and your vision 📔
                <br />
                <span className="text-opacity-50 text-sm">
                  (so will the future mission leaders)
                </span>
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

            <Button primary type="submit" className="w-full mt-8">
              Create Job
            </Button>
          </Form>
        )}
      </Formik>
    </Message>
  );
};

export default OrganizationJobsCreate;
