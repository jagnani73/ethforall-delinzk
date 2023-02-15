import type { MessageProps } from "@/utils/types/shared.types";

const Message: React.FC<MessageProps> = ({ children, className = "" }) => {
  return (
    <main
      className={`flex m-auto py-8 px-12 bg-white effect-shadow ${className}`}
    >
      {children}
    </main>
  );
};

export default Message;
