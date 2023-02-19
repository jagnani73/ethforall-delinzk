import { Router, Request, Response, NextFunction } from "express";

import { getAllJobs } from "./jobs.service";

const router = Router();

const handleGetJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await getAllJobs();
    res.json({
      success: true,
      jobs: jobs,
    });
  } catch (err) {
    next(err);
  }
};

router.get("/", handleGetJobs);

export default router;
