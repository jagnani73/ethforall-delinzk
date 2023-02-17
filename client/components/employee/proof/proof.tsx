import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { io } from "socket.io-client";

import type { EmployeeProofProps } from "@/utils/types/employee.types";
import type {
  CustomFieldTypes,
  FieldClassnames,
} from "@/utils/types/shared.types";
import { Button, CustomField, Message, QRPage } from "@/components/shared";
import {
  CreateYupSchema,
  DatesToTenure,
  PopPromiseToast,
} from "@/utils/functions";
import { EmpProof } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";
import { useRouter } from "next/router";

const EmployeeProof: React.FC<EmployeeProofProps> = ({ organizations }) => {
  const [qr, setQR] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { JWE } = useAuth();

  const { replace } = useRouter();

  const socket = useRef<Socket>();

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
        name: "organization_id",
        id: "organization_id",
        type: "select",
        choices: organizations.map(({ id, name }) => ({
          content: name,
          value: id,
        })),
        label: "Employee email to send claim offer",
        placeholder: "Select an organization",
        classnames: CLASSNAMES,
      },
    ],
    [CLASSNAMES, organizations]
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

  useEffect(() => {
    if (sessionId) {
      socket.current = io(process.env.NEXT_PUBLIC_API_HOSTNAME!, {
        reconnectionDelayMax: 10000,
        extraHeaders: {
          "Bypass-Tunnel-Reminder": "true",
        },
        query: {
          "x-session-id": sessionId,
        },
      });

      socket.current.on("proof", () => {
        replace("/employee/profile");
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const submitHandler = useCallback(
    async (values: Record<string, any>) => {
      try {
        const employee_tenure: number = DatesToTenure(
          values["employee_start_date"],
          values["employee_end_date"] ?? null
        );

        const proofPromise = EmpProof(
          JWE!,
          employee_tenure,
          values["organization_id"]
        );
        PopPromiseToast(
          proofPromise,
          "generating proof...",
          "proof generated",
          "please try again"
        );
        const { qr, sessionId } = await proofPromise;
        setQR(qr);
        setSessionId(sessionId);
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    [JWE]
  );

  return (
    <>
      {!qr ? (
        <Message>
          <Formik
            enableReinitialize
            onSubmit={submitHandler}
            initialValues={{
              organization_id: "",
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
                  <span className="text-slate-blue">1/2</span> Generate
                  Proof-of-Employment ⚙️
                </h2>

                <p className="text-onyx text-opacity-75 my-4">
                  Confirm that you have a Proof-of-Employment
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

                <Button
                  primary
                  type="submit"
                  className="mt-8 px-10 mx-auto flex"
                >
                  Generate Proof 📩
                </Button>
              </Form>
            )}
          </Formik>
        </Message>
      ) : (
        <QRPage
          qr={qr}
          heading={
            <>
              <span className="text-slate-blue">2/2</span> Prove ownership of
              the Proof-of-Employment
            </>
          }
          description={
            <>
              Please scan the QR code below using the{" "}
              <span className="font-semibold text-slate-blue">
                Polygon ID application
              </span>{" "}
              only to connect your wallet address to deLinZK.
            </>
          }
          footer={
            <p className="mt-4 text-center font-bold text-red-600">
              Make sure you use the wallet that was used to signup.
            </p>
          }
        />
      )}
    </>
  );
};

export default EmployeeProof;
