import * as yup from "yup"

export const userClaimPoeRequestSchema = yup.object({
  reqId: yup.string().trim().required("reqId is required"),
});

export type userClaimPoeRequest = yup.InferType<
  typeof userClaimPoeRequestSchema
>;
