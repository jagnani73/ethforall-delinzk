import { Router, Request, Response, NextFunction } from "express";

import validateQuery from "../middleware/verify-query.middleware";
import injectSessionId from "../middleware/session.middleware";
import {
  userClaimPoeRequest,
  userClaimPoeRequestSchema,
  userSignUpRequest,
  userSignUpRequestSchema,
} from "./user.schema";
import {
  checkIfClaimOfferExists,
  createEmptyUser,
  generateAuthQr,
  listenForClaimAuthComplete,
  storeUserDetails,
  storeUserPhoto,
} from "./user.service";
import { authVerify, generateClaimAuth } from "../org/org.service";
import getRawBody from "raw-body";
import { parseUserPhoto } from "../middleware/multer.middleware";
import verifyUser from "../middleware/verify-user.middleware";

const router = Router();

const handleClaimPoe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { reqId } = req.query as userClaimPoeRequest;
  const { available, claimOfferId } = await checkIfClaimOfferExists(reqId);
  if (!available) {
    return res.status(404).json({
      success: false,
      message: `Link has expired / has been already claimed.`,
    });
  } else {
    const { claimOfferSessionId, qrCode } = await generateClaimAuth(
      claimOfferId!
    );
    await listenForClaimAuthComplete(reqId, claimOfferId!, claimOfferSessionId);
    res.json(qrCode);
  }
};

const handleUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const qrData = await generateAuthQr(res.locals.sessionId, "sign-up");
    res.setHeader("x-delinzk-session-id", res.locals.sessionId);
    res.setHeader("Access-Control-Expose-Headers", "x-delinzk-session-id");
    res.json(qrData);
  } catch (err) {
    next(err);
  }
};

const handleUserSignUpCallback = async (
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
    const result = await authVerify(sessionId as string, jwz, false);
    console.log("handleOrgSignInCallback authResponse:");
    console.dir(result, { depth: null });
    const userDid = result?.from;
    const userId = await createEmptyUser(userDid!);
    console.log("Empty user created with ID:", userId);
    res.send("OK");
  } catch (err) {
    next(err);
  }
};

const handleUserSignUpComplete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "ValidationError: employee_photo is required.",
      });
    }
    const {
      employee_about: about,
      employee_email: email,
      employee_industry: industry,
      employee_name: name,
      employee_username: username,
      did,
    } = req.body as userSignUpRequest;
    const photo = req.file as Express.Multer.File;
    const photoUrl = await storeUserPhoto(photo);
    await storeUserDetails(did, {
      about,
      email,
      industry,
      name,
      username,
      photo: photoUrl,
    });
    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

const handleUserSignInCallback = async (
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

const handleUserSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const qrData = await generateAuthQr(res.locals.sessionId,"sign-in");
    res.setHeader("x-delinzk-session-id", res.locals.sessionId);
    res.setHeader("Access-Control-Expose-Headers", "x-delinzk-session-id");
    res.json(qrData);
  } catch (err) {
    next(err);
  }
};

const handleUserMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, did } = res.locals.user;
    res.json({
      success: true,
      id: id,
      did: did,
    });
  } catch (err) {
    next(err);
  }
};

router.get(
  "/claim-poe",
  validateQuery("query", userClaimPoeRequestSchema),
  handleClaimPoe
);
router.get("/sign-up", injectSessionId, handleUserSignUp);
router.get("/sign-in", injectSessionId, handleUserSignIn);
router.post("/sign-up-callback", handleUserSignUpCallback);
router.post("/sign-in-callback", handleUserSignInCallback);
router.post(
  "/sign-up-complete",
  parseUserPhoto(),
  validateQuery("body", userSignUpRequestSchema),
  handleUserSignUpComplete
);
router.get("/me", verifyUser, handleUserMe);

export default router;
