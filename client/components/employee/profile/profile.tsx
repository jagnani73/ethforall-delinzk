/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import type {
  CustomFieldTypes,
  FieldClassnames,
} from "@/utils/types/shared.types";
import type { EmployeeType } from "@/utils/types/employee.types";
import { EmpProfileUpdate } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";
import { Button, CustomField, Message } from "@/components/shared";
import { CreateYupSchema } from "@/utils/functions";

const EmployeeProfile: React.FC = () => {
  const [employee, setEmployee] = useState<EmployeeType | null>(null);

  const { JWE } = useAuth();

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
        id: "emp_name",
        name: "emp_name",
        type: "text",
        placeholder: "Enter the name",
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
        id: "emp_username",
        name: "emp_username",
        type: "text",
        placeholder: "Whats your username?",
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
        id: "emp_industry",
        name: "emp_industry",
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
        id: "emp_about",
        name: "emp_about",
        type: "textarea",
        placeholder: "Something about yourself...",
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
        id: "emp_email",
        name: "emp_email",
        type: "email",
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
    ],
    [CLASSNAMES]
  );

  useEffect(() => {
    (async () => {
      try {
        // setEmployee(await EmpProfile(JWE!));
        setEmployee({
          about:
            "Esse duis est adipisicing cupidatat est velit id. Nisi commodo non eu anim excepteur dolor ullamco occaecat. Nisi eiusmod non eu ea elit tempor velit id ex ea dolore quis sit. Labore sit fugiat eu ex aliqua laboris eu sunt ipsum Lorem sunt laborum occaecat. Cupidatat non occaecat eiusmod sunt labore culpa aute. Culpa reprehenderit fugiat in minim excepteur id veniam excepteur tempor ea officia consectetur.",
          email: "ranunk73@gmail.com",
          industry: "Tech",
          name: "Lorem Ipsum",
          photo: "https://picsum.photos/200",
          username: "unique@23",
        });
      } catch (error) {
        console.error(error);
      } finally {
      }
    })();
  }, [JWE]);

  const submitHandler = useCallback(
    async (values: Record<string, any>) => {
      try {
        const data = new FormData();
        Object.entries(values).map(([key, value]: [string, string | File]) => {
          data.append(key, value);
        });

        await EmpProfileUpdate(JWE!, data);
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    [JWE]
  );

  return (
    <>
      {!employee ? (
        <div>loading</div>
      ) : (
        <Message>
          <Formik
            enableReinitialize
            onSubmit={submitHandler}
            initialValues={{
              emp_name: employee?.name,
              emp_about: employee?.about,
              emp_username: employee?.username,
              emp_industry: employee?.industry,
              emp_email: employee?.email,
            }}
            validationSchema={Yup.object().shape(
              FIELDS.reduce(CreateYupSchema, {})
            )}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form className="w-96">
                <div className="mb-8">
                  <h3 className="font-semibold text-2xl mb-4">Profile</h3>

                  <figure>
                    <img
                      src={employee.photo}
                      alt={`${employee.username} on deLinZK`}
                      height={120}
                      width={120}
                    />
                  </figure>
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
                    htmlFor="emp_photo"
                    className={`${CLASSNAMES.input} cursor-pointer`}
                  >
                    <span
                      className={
                        // @ts-ignore
                        values["emp_photo"]?.name
                          ? ""
                          : "text-onyx text-opacity-50"
                      }
                    >
                      {/* @ts-ignore */}
                      {values["emp_photo"]?.name ?? "Change photo"}
                    </span>

                    <input
                      id="emp_photo"
                      name="emp_photo"
                      className="hidden"
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) =>
                        setFieldValue("emp_photo", e.target.files![0])
                      }
                    />
                  </label>
                </div>

                <Button primary type="submit" className="w-full mt-6">
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Message>
      )}
    </>
  );
};

export default EmployeeProfile;
