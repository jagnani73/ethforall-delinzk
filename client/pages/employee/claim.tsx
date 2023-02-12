import type { GetServerSideProps, NextPage } from "next";

import type { EmployeeClaimPageProps } from "@/utils/types/employee.types";
import { EmployeeClaim } from "@/components/employee/claim";
import { EmpClaim } from "@/utils/services/api";

const EmployeeClaimPage: NextPage<EmployeeClaimPageProps> = ({ linkQR }) => {
  return <EmployeeClaim linkQR={linkQR} />;
};

export default EmployeeClaimPage;

export const getServerSideProps: GetServerSideProps<
  EmployeeClaimPageProps
> = async (ctx) => {
  try {
    if (!ctx.query?.reqId)
      return {
        notFound: true,
      };

    return {
      props: {
        linkQR: await EmpClaim(ctx.query?.reqId as string),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
