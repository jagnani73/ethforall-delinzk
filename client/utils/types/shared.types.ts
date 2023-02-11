import React from "react";

export interface FieldClassnames {
  wrapper?: string;
  input?: string;
  description?: string;
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
  choices: { value: string; text: string }[];
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
