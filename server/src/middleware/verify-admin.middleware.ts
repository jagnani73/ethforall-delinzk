import { JwtPayload, verify } from "jsonwebtoken";
import * as yup from "yup";
import { Request, Response, NextFunction } from "express";

const JwtRequestSchema = yup
  .object({
    authorization: yup
      .string()
      .trim()
      .min(1, "JWT cannot be null")
      .matches(/^Bearer .+$/, "JWT should be Bearer Token"),
  })
  .required();

type JwtRequest = yup.InferType<typeof JwtRequestSchema>;

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    try {
      await JwtRequestSchema.validate(req.headers, { abortEarly: false });
    } catch (error: Error | any) {
      let message: string = "";
      error.errors.forEach((e: string) => {
        message += `${e}. `;
      });
      throw {
        errorCode: 400,
        name: "JWT Validation Error",
        message: message,
      };
    }
    const { authorization } = req.headers as JwtRequest;
    if (!authorization) {
      return next({
        errorCode: 403,
        name: "JWT Error",
        message: "JWT must be in Bearer <token>  format.",
      });
    }
    const authToken = authorization.split(" ")[1];
    const payload = verify(authToken, process.env.ADMIN_JWT_SECRET_KEY!, {
      issuer: "deLinZK",
    }) as JwtPayload;
    if (payload.admin) {
      next();
    } else {
      next({
        errorCode: 403,
        name: "Unauthorized",
        message: "Admin JWT must be provided.",
      });
    }
  } catch (err: Error | any) {
    next({
      errorCode: 403,
      name: "JWT Validation Error",
      message: `${err.name}: ${err.message}`,
    });
  }
};

export default verifyAdmin;
