import type { GetServerSideProps, NextPage } from "next";

import type { EmployeeSigninPageProps } from "@/utils/types/employee.types";
import { EmpSignin } from "@/utils/services/api";
import { EmployeeSignin } from "@/components/employee/signin";

const EmployeeSigninPage: NextPage<EmployeeSigninPageProps> = ({
  qr,
  sessionId,
}) => {
  return <EmployeeSignin qr={qr} sessionId={sessionId} />;
};

export default EmployeeSigninPage;

export const getServerSideProps: GetServerSideProps<
  EmployeeSigninPageProps
> = async (_ctx) => {
  try {
    const { qr, sessionId } = await EmpSignin();
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
