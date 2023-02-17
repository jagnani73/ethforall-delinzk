import * as yup from "yup";

export const userClaimPoeRequestSchema = yup.object({
  reqId: yup.string().trim().required("reqId is required"),
});

export type userClaimPoeRequest = yup.InferType<
  typeof userClaimPoeRequestSchema
>;

export const userSignUpRequestSchema = yup.object({
  employee_name: yup.string().trim().required("employee_name is required"),
  employee_username: yup
    .string()
    .trim()
    .required("employee_username is required"),
  employee_industry: yup
    .string()
    .trim()
    .required("employee_industry is required"),
  employee_about: yup.string().trim().required("employee_about is required"),
  employee_email: yup
    .string()
    .trim()
    .email("employee_email must be a valid e-mail")
    .required("employee_email is required"),
  did: yup.string().trim().required("did is required"),
});

export type userSignUpRequest = yup.InferType<typeof userSignUpRequestSchema>;

export const userUpdateRequestSchema = yup.object({
  employee_name: yup.string().trim().required("employee_name is required"),
  employee_industry: yup
    .string()
    .trim()
    .required("employee_industry is required"),
  employee_about: yup.string().trim().required("employee_about is required"),
});

export type userUpdateRequest = yup.InferType<typeof userUpdateRequestSchema>;
