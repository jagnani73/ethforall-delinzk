import type { GetServerSideProps, NextPage } from "next";

import type { OrganizationSigninPageProps } from "@/utils/types/organization.types";
import { OrgSignin } from "@/utils/services/api";
import { OrganizationSignin } from "@/components/organization/signin";

const OrganizationsSigninPage: NextPage<OrganizationSigninPageProps> = ({
  qr,
  sessionId,
}) => {
  return <OrganizationSignin qr={qr} sessionId={sessionId} />;
};

export default OrganizationsSigninPage;

export const getServerSideProps: GetServerSideProps<
  OrganizationSigninPageProps
> = async (_ctx) => {
  try {
    const { qr, sessionId } = await OrgSignin();
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
