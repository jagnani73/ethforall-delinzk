import express, { Request, Response, NextFunction, Router } from "express";
import getRawBody from "raw-body";

import injectSessionId from "../middleware/session.middleware";
import {
  generateAuthQr,
  authVerify,
  storeOrganizerData,
  storeAndUpdateLicense,
  storeVerificationState,
  sendEmailToOrganization,
  checkIfRequestIdExists,
  generateBasicAuthQr,
  storeOrgDid,
  clearSignupCache,
  generateOrgClaim,
  Attributes,
  generateClaimOffer,
  storeClaimOffer,
  sendClaimOfferEmail,
  sendOrganizationSignupCompleteEmail,
  getOrgsData,
} from "./org.service";
import { parseLicense } from "../middleware/multer.middleware";
import validateQuery from "../middleware/verify-query.middleware";
import {
  orgApproveRequest,
  orgApproveRequestSchema,
  orgCreatePoeRequest,
  orgCreatePoeRequestSchema,
  orgSignUpCompleteRequest,
  orgSignUpCompleteRequestSchema,
  orgSignUpRequest,
  orgSignUpRequestSchema,
} from "./org.schema";
import verifyAdmin from "../middleware/verify-admin.middleware";
import verifyOrg from "../middleware/verify-org.middleware";

const router = Router();

const handleOrgSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const qrData = await generateAuthQr(res.locals.sessionId);
    res.setHeader("x-delinzk-session-id", res.locals.sessionId);
    res.setHeader("Access-Control-Expose-Headers", "x-delinzk-session-id");
    res.json(qrData);
  } catch (err) {
    next(err);
  }
};

const handleOrgSignInCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.query.sessionId;
    console.log("Callback session ID:", sessionId);
    const raw = await getRawBody(req);
    const jwz = raw.toString().trim();
    console.log("JWZ Received:");
    console.dir(jwz, { depth: null });
    const result = await authVerify(sessionId as string, jwz);
    console.log("handleOrgSignInCallback authResponse:");
    console.dir(result, { depth: null });
    res.send("OK");
  } catch (err) {
    next(err);
  }
};

const handleOrgSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "ValidationError: org_license is required.",
      });
    }
    const {
      org_email: email,
      org_industry: industry,
      org_name: name,
      org_size: size,
      org_tagline: tagline,
    } = req.body as orgSignUpRequest;
    const license = req.file as Express.Multer.File;
    const insertedId = await storeOrganizerData(
      email,
      name,
      industry,
      tagline,
      size
    );
    await storeAndUpdateLicense(insertedId, license);
    Promise.all([sendOrganizationSignupCompleteEmail(insertedId)]).catch((e) =>
      console.error(e)
    );
    res.json({
      success: true,
      id: insertedId,
    });
  } catch (err) {
    next(err);
  }
};

const handleApproveOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { org_id } = req.body as orgApproveRequest;

    const requestId = await storeVerificationState(org_id);
    if (requestId) {
      await sendEmailToOrganization(requestId, org_id);
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

const handleOrgSignUpComplete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reqId } = req.query as orgSignUpCompleteRequest;
    const requestExists = await checkIfRequestIdExists(reqId);
    if (!requestExists) {
      return res.status(404).json({
        success: false,
        message: `Link has expired / has been already claimed.`,
      });
    } else {
      const qrData = await generateBasicAuthQr(reqId);
      res.json(qrData);
    }
  } catch (err) {
    next(err);
  }
};

const handleOrgSignUpCompleteCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.query.sessionId as unknown as string;
    console.log("Signup Complete Callback session ID:", sessionId);
    const raw = await getRawBody(req);
    const jwz = raw.toString().trim();
    console.log("JWZ Received:");
    console.dir(jwz, { depth: null });
    const result = await authVerify(sessionId as string, jwz, false);
    console.log("handleOrgSignUpCompleteCallback authResponse:");
    console.dir(result, { depth: null });
    const orgDid = result?.from!;
    const orgId = await storeOrgDid(orgDid, sessionId);
    await generateOrgClaim(sessionId);
    await clearSignupCache(orgId, sessionId);
    res.send("OK");
  } catch (err) {
    next(err);
  }
};

const handleOrgCreatePoe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employee_email: email, employee_tenure: tenure } =
      req.body as orgCreatePoeRequest;
    const { id, did } = res.locals.org;
    const attributes: Attributes = [
      {
        attributeKey: "deLinZK Organization ID",
        attributeValue: id,
      },
      {
        attributeKey: "Tenure",
        attributeValue: +tenure,
      },
    ];
    const claimOfferId = await generateClaimOffer(
      process.env.POLYGONID_CLAIMSCHEMAID_PROOF_OF_EMPLOYMENT!,
      attributes
    );
    const reqId = await storeClaimOffer(claimOfferId);
    await sendClaimOfferEmail(email, reqId);
    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

const handleGetOrgsData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, projection } = req.query;
    const parsedId = id ? +id : undefined;
    const parsedProjection: string[] = [];
    if (projection) {
      (projection as string)
        .split(",")
        .forEach((e) => e.length > 0 ? parsedProjection.push(e) : null);
    }
    const data = await getOrgsData(parsedProjection, parsedId);
    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

router.get("/sign-in", injectSessionId, handleOrgSignIn);
router.post("/sign-in-callback", handleOrgSignInCallback);
router.post(
  "/sign-up",
  parseLicense(),
  validateQuery("body", orgSignUpRequestSchema),
  handleOrgSignUp
);
router.post(
  "/approve",
  verifyAdmin,
  express.json(),
  validateQuery("body", orgApproveRequestSchema),
  handleApproveOrg
);

router.get(
  "/sign-up-complete",
  validateQuery("query", orgSignUpCompleteRequestSchema),
  handleOrgSignUpComplete
);

router.post("/sign-up-complete-callback", handleOrgSignUpCompleteCallback);
router.post(
  "/create-poe",
  express.json(),
  verifyOrg,
  validateQuery("body", orgCreatePoeRequestSchema),
  handleOrgCreatePoe
);
router.get("/data", handleGetOrgsData);

export default router;
