import { Request, Response, NextFunction, Router } from "express";

import verifyAdmin from "../middleware/verify-admin.middleware";
import validateQuery from "../middleware/verify-query.middleware";
import {
  adminLoginRequestSchema,
  adminSignupRequest,
  adminSignupRequestSchema,
} from "./admin.schema";
import {
  createJWToken,
  fetchOrganizations,
  storeAdminCredentials,
  verifyAdminCredentials,
} from "./admin.service";

const router = Router();

const handleAdminSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      admin_email: email,
      admin_password: password,
      admin_secret,
    } = req.body as adminSignupRequest;
    if (admin_secret !== process.env.ADMIN_SECRET) {
      return res.status(400).json({
        success: false,
        message: "admin_secret is not valid.",
      });
    }
    await storeAdminCredentials(email, password);
    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

const handleAdminLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { admin_email: email, admin_password: password } =
      req.body as adminSignupRequest;

    await verifyAdminCredentials(email, password);
    const token = await createJWToken(email);
    res.json({
      success: true,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

const handleAdminFetchOrgs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizations = await fetchOrganizations();
    res.json({ success: true, organizations });
  } catch (err) {
    next(err);
  }
};

router.get("/orgs", verifyAdmin, handleAdminFetchOrgs);
router.post(
  "/sign-up",
  validateQuery("body", adminSignupRequestSchema),
  handleAdminSignup
);
router.post(
  "/log-in",
  validateQuery("body", adminLoginRequestSchema),
  handleAdminLogIn
);

export default router;
