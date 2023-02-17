import * as yup from "yup";

export const adminSignupRequestSchema = yup.object({
  admin_email: yup
    .string()
    .trim()
    .email("admin_email must be a valid e-mail")
    .required("admin_email is required"),
  admin_password: yup.string().trim().required("admin_password is required"),
  admin_secret: yup.string().trim().required("admin_secret is required"),
});

export type adminSignupRequest = yup.InferType<typeof adminSignupRequestSchema>;

export const adminLoginRequestSchema = yup.object({
  admin_email: yup
    .string()
    .trim()
    .email("admin_email must be a valid e-mail")
    .required("admin_email is required"),
  admin_password: yup.string().trim().required("admin_password is required"),
});

export type adminLoginRequest = yup.InferType<typeof adminLoginRequestSchema>;
