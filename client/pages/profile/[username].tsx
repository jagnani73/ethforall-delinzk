import type { GetServerSideProps, NextPage } from "next";

import type { ProfileUsernamePageProps } from "@/utils/types/profile.types";
import { PublicProfile } from "@/utils/services/api";
import { Profile } from "@/components/shared";

const OrganizationSigninPage: NextPage<ProfileUsernamePageProps> = ({
  employee,
}) => {
  return <Profile publicProfile employee={employee} />;
};

export default OrganizationSigninPage;

export const getServerSideProps: GetServerSideProps<
  ProfileUsernamePageProps
> = async ({ params }) => {
  try {
    return {
      props: {
        employee: await PublicProfile(params?.username as string),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
