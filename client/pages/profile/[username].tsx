import type { GetServerSideProps, NextPage } from "next";

import type { ProfileUsernamePageProps } from "@/utils/types/profile.types";
import { PublicProfile } from "@/utils/services/api";
import { ProfileUsername } from "@/components/profile";

const OrganizationSigninPage: NextPage<ProfileUsernamePageProps> = ({
  employee,
}) => {
  return <ProfileUsername employee={employee} />;
};

export default OrganizationSigninPage;

export const getServerSideProps: GetServerSideProps<
  ProfileUsernamePageProps
> = async (ctx) => {
  try {
    if (!ctx.params?.username)
      return {
        notFound: true,
      };

    return {
      props: {
        employee: await PublicProfile(ctx.params?.username as string),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
