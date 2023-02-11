import type { MessageProps } from "@/utils/types/shared.types";

const Message: React.FC<MessageProps> = ({ children }) => {
  return (
    <div className="flex my-auto w-fit border-l-8 border-b-8 mx-auto border-slate-blue">
      <main className="w-full mx-auto py-12 px-12 bg-white">{children}</main>
    </div>
  );
};

export default Message;
