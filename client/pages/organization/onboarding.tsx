import type { GetServerSideProps, NextPage } from "next";

import type { OrganizationOnboardingPageProps } from "@/utils/types/organization.types";
import { OrganizationOnboarding } from "@/components/organization/onboarding";
import { OrgSignupComplete } from "@/utils/services/api";

const OrganizationOnboardingPage: NextPage<OrganizationOnboardingPageProps> = ({
  linkQR,
}) => {
  return <OrganizationOnboarding linkQR={linkQR} />;
};

export default OrganizationOnboardingPage;

export const getServerSideProps: GetServerSideProps<
  OrganizationOnboardingPageProps
> = async (ctx) => {
  try {
    if (!ctx.query?.reqId)
      return {
        notFound: true,
      };

    return {
      props: {
        linkQR: await OrgSignupComplete(ctx.query?.reqId as string),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
