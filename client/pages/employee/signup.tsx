import type { GetServerSideProps, NextPage } from "next";

import type { EmployeeSignupPageProps } from "@/utils/types/employee.types";
import { EmployeeSignup } from "@/components/employee/signup";
import { EmpSignupQR } from "@/utils/services/api";

const EmployeeSignupPage: NextPage<EmployeeSignupPageProps> = ({
  qr,
  sessionId,
}) => {
  return <EmployeeSignup qr={qr} sessionId={sessionId} />;
};

export default EmployeeSignupPage;

export const getServerSideProps: GetServerSideProps<
  EmployeeSignupPageProps
> = async (_ctx) => {
  try {
    const { qr, sessionId } = await EmpSignupQR();
    return {
      props: {
        sessionId,
        qr: JSON.stringify(qr),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
