import * as yup from "yup";

export const orgSignUpRequestSchema = yup.object({
  org_name: yup.string().trim().required("org_name is required"),
  org_industry: yup.string().trim().required("org_industry is required"),
  org_tagline: yup.string().trim().required("org_tagline is required"),
  org_size: yup.number().required("org_size is required"),
  org_email: yup
    .string()
    .trim()
    .email("org_email must be a valid e-mail")
    .required("org_email is required"),
});

export type orgSignUpRequest = yup.InferType<typeof orgSignUpRequestSchema>;

export const orgApproveRequestSchema = yup.object({
  org_id: yup.number().required("org_id is required"),
});

export type orgApproveRequest = yup.InferType<typeof orgApproveRequestSchema>;

export const orgSignUpCompleteRequestSchema = yup.object({
  reqId: yup.string().trim().required("reqId is required"),
});

export type orgSignUpCompleteRequest = yup.InferType<
  typeof orgSignUpCompleteRequestSchema
>;

export const orgCreatePoeRequestSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("email must be a valid e-mail ID")
    .required("email is required"),
  tenure: yup.number().required("tenure is required"),
});

export type orgCreatePoeRequest = yup.InferType<
  typeof orgCreatePoeRequestSchema
>;
