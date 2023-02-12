import type { MessageProps } from "@/utils/types/shared.types";

const Message: React.FC<MessageProps> = ({ children }) => {
  return (
    <div className="flex my-auto w-fit effect-shadow mx-auto">
      <main className="w-fit mx-auto py-8 px-12 bg-white">{children}</main>
    </div>
  );
};

export default Message;
