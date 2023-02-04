const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ className, ...props }) => {
  return (
    <button
      {...props}
      className={`rounded-lg px-2 py-4 bg-slate-blue text-white font-medium ${className}`}
    />
  );
};

export default Button;
