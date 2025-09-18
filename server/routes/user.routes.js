import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { getJobsByRecruiter, getJobApplications } from "../controllers/job.controller.js";
import { getUserApplications } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.get("/recruiter", verifyToken, getJobsByRecruiter);
router.get("/:jobId/applications", verifyToken, getJobApplications);
router.get("/applications", verifyToken, getUserApplications);

export default router;
