import type { GetServerSideProps, NextPage } from "next";

import type { OrganizationsOnboardingPageProps } from "@/utils/types/organizations.types";
import { OrganizationsOnboarding } from "@/components/organizations/onboarding";
import { OrgSignupComplete } from "@/utils/services/api";

const OrganizationsOnboardingPage: NextPage<
  OrganizationsOnboardingPageProps
> = ({ qr }) => {
  return <OrganizationsOnboarding qr={qr} />;
};

export default OrganizationsOnboardingPage;

export const getServerSideProps: GetServerSideProps<
  OrganizationsOnboardingPageProps
> = async (ctx) => {
  try {
    if (!ctx.query?.reqId)
      return {
        notFound: true,
      };

    return {
      props: {
        qr: await OrgSignupComplete(ctx.query?.reqId as string),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
