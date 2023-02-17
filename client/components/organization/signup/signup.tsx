import { useCallback, useMemo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button, CustomField, Message } from "@/components/shared";
import { CreateYupSchema, PopPromiseToast } from "@/utils/functions";
import { OrgSignup } from "@/utils/services/api";
import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";

const OrganizationSignup: React.FC = () => {
  const [received, setReceived] = useState<boolean>(false);

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
        id: "org_name",
        name: "org_name",
        type: "text",
        placeholder: "Enter the organization name",
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
        placeholder: "Enter the type of Industry",
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
        placeholder: "Enter the team size",
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
        placeholder: "Enter the organization tagline",
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
        placeholder: "Enter the organization email address",
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

      const signupPromise = OrgSignup(data);
      PopPromiseToast(
        signupPromise,
        "signing up...",
        "signed up",
        "please try again"
      );
      await signupPromise;
      setReceived(true);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }, []);

  return (
    <Message>
      {!received ? (
        <Formik
          enableReinitialize
          onSubmit={submitHandler}
          initialValues={{}}
          validationSchema={Yup.object().shape(
            FIELDS.reduce(CreateYupSchema, {})
          )}
        >
          {({ errors, touched, values, setFieldValue }) => (
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

                <label
                  htmlFor="org_license"
                  className={`${CLASSNAMES.input} cursor-pointer`}
                >
                  <span
                    className={
                      // @ts-ignore
                      values["org_license"]?.name
                        ? ""
                        : "text-onyx text-opacity-50"
                    }
                  >
                    {/* @ts-ignore */}
                    {values["org_license"]?.name ??
                      "Upload the organization license"}
                  </span>

                  <input
                    id="org_license"
                    name="org_license"
                    className="hidden"
                    type="file"
                    required
                    onChange={(e) =>
                      setFieldValue("org_license", e.target.files![0])
                    }
                  />
                </label>
              </div>

              <Button primary type="submit" className="w-full mt-6">
                Join the experience ✨
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          <h2 className="text-4xl font-semibold">Congratulations 🎉</h2>

          <h3 className="mt-8 text-xl">
            Verification can take a few days, you will receive an email when you
            have been successfully verified.
          </h3>

          <p className="mt-6 text-onyx text-opacity-75">
            HODL your breath, you are about to be identified on the network!
          </p>
        </>
      )}
    </Message>
  );
};

export default OrganizationSignup;
