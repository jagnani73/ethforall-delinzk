import type { EmployeeApplicationsProps } from "@/utils/types/employee.types";
import { Message } from "@/components/shared";

const EmployeeApplications: React.FC<EmployeeApplicationsProps> = ({
  applications,
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="mt-12 text-4xl font-bold ml-8">Applicants</h2>

      <div className="flex h-fit gap-x-16 m-auto w-full overflow-x-auto p-8">
        {applications.length ? (
          applications.map(
            ({
              id,
              job: {
                name: jobName,
                org: { name: orgName },
              },
            }) => (
              <Message
                key={id}
                className="w-fit whitespace-nowrap  px-4 py-2 mb-4"
              >
                <div className="w-40">
                  <p className="text-slate-blue text-sm font-medium mt-4">
                    ORGANIZATION
                  </p>
                  <p className="text-lg mb-2">{orgName}</p>

                  <p className="text-slate-blue text-sm font-medium mt-4">
                    JOB TITLE
                  </p>
                  <p className="text-lg mb-2">{jobName}</p>
                </div>
              </Message>
            )
          )
        ) : (
          <Message>
            <p className="text-2xl">No jobs listed</p>
          </Message>
        )}
      </div>
    </div>
  );
};

export default EmployeeApplications;
