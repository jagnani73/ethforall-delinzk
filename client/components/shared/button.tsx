import type { ButtonProps } from "@/utils/types/shared.types";

const Button: React.FC<ButtonProps> = ({
  className = "",
  primary,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`rounded-lg px-2 py-4 font-bold ${
        primary ? "bg-slate-blue text-white" : "bg-white text-slate-blue"
      } ${className}`}
    />
  );
};

export default Button;
