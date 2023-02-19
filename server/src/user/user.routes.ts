import express, { Router, Request, Response, NextFunction } from "express";

import validateQuery from "../middleware/verify-query.middleware";
import injectSessionId from "../middleware/session.middleware";
import {
  addPoeRequest,
  addPoeRequestSchema,
  applyJobRequest,
  applyJobRequestSchema,
  userClaimPoeRequest,
  userClaimPoeRequestSchema,
  userSignUpRequest,
  userSignUpRequestSchema,
  userUpdateRequest,
  userUpdateRequestSchema,
} from "./user.schema";
import {
  checkIfClaimOfferExists,
  createEmptyUser,
  fetchUserPrivateDetails,
  fetchUserPublicDetails,
  generateAuthQr,
  listenForClaimAuthComplete,
  sendUserSignupCompleteEmail,
  storeUserPhoto,
  updateUserDetails,
  generateProofQr,
  storeProofOfEmployment,
  userApplyJob,
  userGetApplications,
  getAllJobsByUser,
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
    await updateUserDetails(did, {
      about,
      email,
      industry,
      name,
      username,
      photo: photoUrl,
    });
    Promise.all([sendUserSignupCompleteEmail(email)]).catch((e) =>
      console.error(e)
    );
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
    const qrData = await generateAuthQr(res.locals.sessionId, "sign-in");
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

const handleUserPublicProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    const profile = await fetchUserPublicDetails(username);
    res.json({
      success: true,
      profile: profile,
    });
  } catch (err) {
    next(err);
  }
};

const handleUserPrivateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { did } = res.locals.user;
    const profile = await fetchUserPrivateDetails(did);
    res.json({
      success: true,
      profile: profile,
    });
  } catch (err) {
    next(err);
  }
};

const handleUserProfileUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { did } = res.locals.user;
    const {
      employee_about: about,
      employee_industry: industry,
      employee_name: name,
    } = req.body as userUpdateRequest;
    await updateUserDetails(did, {
      about,
      industry,
      name,
    });
    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

const handleAddPoe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = res.locals.sessionId;
    const { id: userId } = res.locals.user;
    const { orgId, tenure } = req.body as addPoeRequest;
    const qrData = await generateProofQr(sessionId, userId, orgId, tenure);
    res.setHeader("x-delinzk-session-id", res.locals.sessionId);
    res.setHeader("Access-Control-Expose-Headers", "x-delinzk-session-id");
    res.json(qrData);
  } catch (err) {
    next(err);
  }
};

const handleAddPoeCallback = async (
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
    Promise.all([storeProofOfEmployment(sessionId as string)]).catch((e) =>
      console.error(e)
    );
    res.send("OK");
  } catch (err) {
    next(err);
  }
};

const handleApplyJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, did } = res.locals.user;
    const { jobId } = req.body as applyJobRequest;
    const applicationId = await userApplyJob(+id, +jobId);
    res.send({
      success: true,
      applicationId: applicationId,
    });
  } catch (err) {
    next(err);
  }
};

const handleGetApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = res.locals.user;
    const applications = await userGetApplications(+id);
    res.send({
      success: true,
      applications: applications,
    });
  } catch (err) {
    next(err);
  }
};

const handleGetUserJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = res.locals.user;
    const applications = await userGetApplications(+id);
    const applicationIds = applications.map((application) => application.id);
    const jobs = await getAllJobsByUser(applicationIds);
    res.send({
      success: true,
      jobs: jobs,
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
router.post(
  "/profile/update",
  verifyUser,
  express.json(),
  validateQuery("body", userUpdateRequestSchema),
  handleUserProfileUpdate
);
router.get("/profile/:username", handleUserPublicProfile);
router.get("/profile", verifyUser, handleUserPrivateProfile);
router.post(
  "/add-poe",
  verifyUser,
  express.json(),
  validateQuery("body", addPoeRequestSchema),
  injectSessionId,
  handleAddPoe
);
router.post("/add-poe-callback", handleAddPoeCallback);
router.post(
  "/apply-job",
  verifyUser,
  express.json(),
  validateQuery("body", applyJobRequestSchema),
  handleApplyJob
);
router.get("/applied-jobs", verifyUser, handleGetApplications);

router.get("/jobs", verifyUser, handleGetUserJobs);

export default router;
