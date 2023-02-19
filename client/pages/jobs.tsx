import type { GetServerSideProps, NextPage } from "next";

import { Jobs } from "@/components/shared";
import { JobsPageProps } from "@/utils/types/shared.types";
import { FetchJobs } from "@/utils/services/api";

const JobsPage: NextPage<JobsPageProps> = ({ jobs }) => {
  return <Jobs jobs={jobs} role={null} />;
};

export default JobsPage;

export const getServerSideProps: GetServerSideProps<
  JobsPageProps
> = async () => {
  try {
    return {
      props: {
        jobs: await FetchJobs(),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
