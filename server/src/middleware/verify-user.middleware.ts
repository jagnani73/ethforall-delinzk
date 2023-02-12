import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import TokenService from "../services/token.service";
import SupabaseService from "../services/supabase.service";

const JweRequestSchema = yup
  .object({
    authorization: yup
      .string()
      .trim()
      .min(1, "JWE cannot be null")
      .matches(/^Bearer .+$/, "JWE should be Bearer Token"),
  })
  .required();

type JweRequest = yup.InferType<typeof JweRequestSchema>;

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    try {
      await JweRequestSchema.validate(req.headers, { abortEarly: false });
    } catch (error: Error | any) {
      let message: string = "";
      error.errors.forEach((e: string) => {
        message += `${e}. `;
      });
      throw {
        errorCode: 400,
        name: "JWE Validation Error",
        message: message,
      };
    }
    const { authorization } = req.headers as JweRequest;
    if (!authorization) {
      return next({
        errorCode: 403,
        name: "JWE Error",
        message: "JWE must be in Bearer <token>  format.",
      });
    }
    const authToken = authorization.split(" ")[1];
    const payload = await TokenService.verifyJWS(
      await TokenService.decryptJWE(authToken)
    );
    const userDid = payload.did;
    const db = await SupabaseService.getSupabase();
    const { data, error } = await db!.from("users").select().eq("did", userDid);
    if (error) {
      const err = {
        errorCode: 500,
        name: "Database Error",
        message: "Supabase database called failed",
        databaseError: error,
      };
      throw err;
    }
    if (!data[0]?.id) {
      return next({
        errorCode: 404,
        name: "Not Found",
        message: "User not found! Please sign-up!",
      });
    }
    res.locals.user = {
      id: data[0].id,
      did: userDid,
    };
    next();
  } catch (err: Error | any) {
    next({
      errorCode: 403,
      name: "JWE Validation Error",
      message: `${err.name}: ${err.message}`,
    });
  }
};

export default verifyUser;
