import type { GetServerSideProps, NextPage } from "next";

import type { EmployeeProofPageProps } from "@/utils/types/employee.types";
import { EmployeeProof } from "@/components/employee/proof";
import { EmpProofOrgs } from "@/utils/services/api";

const EmployeeProofPage: NextPage<EmployeeProofPageProps> = ({
  organizations,
}) => {
  return <EmployeeProof organizations={organizations} />;
};

export default EmployeeProofPage;

export const getServerSideProps: GetServerSideProps<
  EmployeeProofPageProps
> = async () => {
  try {
    return {
      props: {
        organizations: await EmpProofOrgs(),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
