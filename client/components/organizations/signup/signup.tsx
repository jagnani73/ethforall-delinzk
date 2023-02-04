import { useCallback, useMemo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button, CustomField } from "@/components/shared";
import { CreateYupSchema } from "@/utils/functions";
import { OrgSignup } from "@/utils/services/api";
import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";

const OrganizationsSignup: React.FC = () => {
  const [received, setReceived] = useState<boolean>(false);

  const CLASSNAMES = useMemo<FieldClassnames>(
    () => ({
      wrapper: "w-full",
      input: "rounded p-4 w-full",
    }),
    []
  );

  const FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "org_name",
        name: "org_name",
        type: "text",
        placeholder: "Name of Organization",
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
        id: "org_industry",
        name: "org_industry",
        type: "text",
        placeholder: "Industry",
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
        id: "org_size",
        name: "org_size",
        type: "number",
        placeholder: "Team Size",
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
        id: "org_tagline",
        name: "org_tagline",
        type: "text",
        placeholder: "Tagline",
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
        id: "org_email",
        name: "org_email",
        type: "email",
        placeholder: "Email",
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

  const submitHandler = useCallback(async (values: Record<string, any>) => {
    try {
      const data = new FormData();
      Object.entries(values).map(([key, value]: [string, string | File]) => {
        data.append(key, value);
      });

      await OrgSignup(data);
      setReceived(true);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }, []);

  return (
    <main className="w-full mt-20">
      {!received ? (
        <Formik
          enableReinitialize
          onSubmit={submitHandler}
          initialValues={{}}
          validationSchema={Yup.object().shape(
            FIELDS.reduce(CreateYupSchema, {})
          )}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="bg-gray-100 flex flex-col justify-center items-center rounded-lg py-8 px-12 mx-auto w-fit">
              <h3 className="font-medium text-4xl text-center mb-8">
                A welcome message line
              </h3>

              <div className="flex flex-col gap-y-4 w-full">
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

                <input
                  id="org_license"
                  name="org_license"
                  type="file"
                  required
                  onChange={(e) =>
                    setFieldValue("org_license", e.target.files![0])
                  }
                />
              </div>

              <Button type="submit" className="w-full mt-6">
                Signup
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="bg-gray-100 flex flex-col justify-center items-center rounded-lg py-8 px-12 mx-auto w-fit mt-20">
          <h2 className="text-4xl font-semibold">Congratulations 🎉</h2>

          <h3 className="mt-8 text-xl">
            We have received your application, and have sent a mail for the
            same.
          </h3>

          <p className="mt-6">
            Verification can take a few days, you will receive an email when you
            have been successfully verified!
          </p>
        </div>
      )}
    </main>
  );
};

export default OrganizationsSignup;
