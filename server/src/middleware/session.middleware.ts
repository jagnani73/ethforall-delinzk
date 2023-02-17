import { NextFunction, Request, Response } from "express";
import { v4 } from "uuid";

const injectSessionId = (req: Request, res: Response, next: NextFunction) => {
  const sessionId = v4();
  res.locals.sessionId = sessionId;
  console.log("Session ID:", sessionId);
  next();
};

export default injectSessionId;
