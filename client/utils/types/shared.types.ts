import type { EmployeeType } from "./employee.types";

export interface FieldClassnames {
  wrapper?: string;
  input?: string;
  label?: string;
  option?: string;
}

export interface Validation {
  validationtype?: string;
  validations?: {
    type: string;
    params?: (string | number | RegExp | any)[];
  }[];
}

interface CustomFieldProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    Validation {
  name: string;
  id: string;
  placeholder?: string;
  type:
    | "text"
    | "textarea"
    | "date"
    | "select"
    | "email"
    | "number"
    | "password"
    | "checkbox"
    | "radio"
    | "file";
  description?: React.ReactNode;
  disabled?: boolean;
  label?: React.ReactNode;
  classnames?: FieldClassnames;
}

export interface CustomInputProps extends CustomFieldProps {
  type: "text" | "date" | "email" | "password" | "number" | "file";
}

export interface CustomTextareaProps extends CustomFieldProps {
  type: "textarea";
}

export interface CustomSelectProps extends CustomFieldProps {
  type: "select";
  choices: { value: string | number; content: React.ReactNode }[];
  placeholder?: string;
}

export interface CustomRadioBoxProps extends CustomFieldProps {
  type: "radio" | "checkbox";
  choices: { value: string; text: string }[];
}

export type CustomFieldTypes =
  | CustomInputProps
  | CustomTextareaProps
  | CustomSelectProps
  | CustomRadioBoxProps;

export interface LayoutProps {
  children: React.ReactNode;
}

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  primary: boolean;
}

export interface QRPageProps {
  heading?: React.ReactNode;
  description?: React.ReactNode;
  qr: string;
  footer?: React.ReactNode;
}

export interface MessageProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ProfileProps {
  publicProfile: boolean;
  employee: EmployeeType;
}

export interface JobProps {
  id: number;
  name: string;
  description: string;
  org: {
    id: number;
    name: string;
  };
}

export interface JobsProps {
  role: "organization" | null;
  jobs: JobProps[];
}

export interface JobsPageProps {
  jobs: JobProps[];
}
