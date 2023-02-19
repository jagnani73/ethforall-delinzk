import type { GetServerSideProps, NextPage } from "next";

import { Jobs } from "@/components/shared";
import { JobsPageProps } from "@/utils/types/shared.types";

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
        jobs: [
          {
            description:
              "Magna id exercitation sunt commodo mollit adipisicing ut veniam nostrud ad ad sunt. Exercitation sint non pariatur magna velit. Sint officia velit anim fugiat amet Lorem officia sit anim do. Aliquip amet nostrud exercitation nostrud non. Culpa ullamco velit sunt sint cupidatat est est dolore proident proident non nisi dolore fugiat. Duis cupidatat cupidatat fugiat anim voluptate fugiat.",
            id: 1,
            name: "Jobb bbbb amazxinf",
            orgName: "adadadadadd",
          },
          {
            description: "Magna ",
            id: 1,
            name: "Jobb bbbb amazxinf",
            orgName: "adadadadadd",
          },
          {
            description:
              "Magna id exercitation sunt commodo mollit adipisicing ut veniam nostrud ad ad sunt. Exercitation sint non pariatur magna velit. Sint officia velit anim fugiat amet Lorem officia sit anim do. Aliquip amet nostrud exercitation nostrud non. Culpa ullamco velit sunt sint cupidatat est est dolore proident proident non nisi dolore fugiat. Duis cupidatat cupidatat fugiat anim voluptate fugiat.",
            id: 1,
            name: "Jobb bbbb amazxinf",
            orgName: "adadadadadd",
          },
          {
            description:
              "Magna id exercitation sunt commodo mollit adipisicing ut veniam nostrud ad ad sunt. Exercitation sint non pariatur magna velit. Sint officia velit anim fugiat amet Lorem officia sit anim do. Aliquip amet nostrud exercitation nostrud non. Culpa ullamco velit sunt sint cupidatat est est dolore proident proident non nisi dolore fugiat. Duis cupidatat cupidatat fugiat anim voluptate fugiat.",
            id: 1,
            name: "Jobb bbbb amazxinf",
            orgName: "adadadadadd",
          },
          {
            description:
              "Magna id exercitation sunt commodo mollit adipisicing ut veniam nostrud ad ad sunt. Exercitation sint non pariatur magna velit. Sint officia velit anim fugiat amet Lorem officia sit anim do. Aliquip amet nostrud exercitation nostrud non. Culpa ullamco velit sunt sint cupidatat est est dolore proident proident non nisi dolore fugiat. Duis cupidatat cupidatat fugiat anim voluptate fugiat.",
            id: 1,
            name: "Jobb bbbb amazxinf",
            orgName: "adadadadadd",
          },
        ],
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};
