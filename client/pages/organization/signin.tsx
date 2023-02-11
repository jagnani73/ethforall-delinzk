import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";

import type { OrganizationSigninPageProps } from "@/utils/types/organization.types";
import { OrgSignin } from "@/utils/services/api";
import { OrganizationSignin } from "@/components/organization/signin";
import { useAuth } from "@/utils/store/auth";

const OrganizationsSigninPage: NextPage<OrganizationSigninPageProps> = ({
  qr,
  sessionId,
}) => {
  const { setSessionId } = useAuth();

  useEffect(() => {
    setSessionId(sessionId);
  }, [sessionId, setSessionId]);

  return <OrganizationSignin qr={qr} />;
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
