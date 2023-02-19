import type { MessageProps } from "@/utils/types/shared.types";

const Message: React.FC<MessageProps> = ({ children, className = "" }) => {
  return (
    <main
      className={`m-auto py-8 px-12 bg-white effect-shadow border-2 border-slate-blue rounded-lg ${className}`}
    >
      {children}
    </main>
  );
};

export default Message;
