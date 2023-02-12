import { Router, Request, Response, NextFunction } from "express";

import validateQuery from "../middleware/verify-query.middleware";
import { userClaimPoeRequest, userClaimPoeRequestSchema } from "./user.schema";
import {
  checkIfClaimOfferExists,
  listenForClaimAuthComplete,
} from "./user.service";
import { generateClaimAuth } from "../org/org.service";

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

router.get(
  "/claim-poe",
  validateQuery("query", userClaimPoeRequestSchema),
  handleClaimPoe
);

export default router;
