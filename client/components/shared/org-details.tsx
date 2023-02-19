import type { OrgDetailsProps } from "@/utils/types/admin.types";

const OrgDetails: React.FC<OrgDetailsProps> = ({ content, heading, icon }) => {
  return (
    <div>
      <h6 className="flex gap-x-2 items-start text-slate-blue font-medium">
        <span className="w-6 h-6 flex">{icon}</span> {heading}
      </h6>

      <p className="text-onyx text-opacity-75 text-lg font-medium">{content}</p>
    </div>
  );
};

export default OrgDetails;
