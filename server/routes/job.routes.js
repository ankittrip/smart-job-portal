// import express from "express";
// import {
//   createJob,
//   getAllJobs,
//   getJobById,
//   applyToJob,
//   getJobsByRecruiter,
//   getJobApplications,
//   withdrawApplication,
//   updateApplication
// } from "../controllers/job.controller.js";

// import { verifyToken } from "../middleware/auth.js";

// const router = express.Router();

// // ROUTES
// router.post("/", verifyToken, createJob); // recruiter
// router.get("/", getAllJobs); // anyone
// router.get("/:id", getJobById); // anyone
// router.post("/:id/apply", verifyToken, applyToJob); // candidate
// router.put("/:jobId/apply", verifyToken, updateApplication); // candidate
// router.delete("/:jobId/apply", verifyToken, withdrawApplication);
// router.get("/recruiter", verifyToken, getJobsByRecruiter); // ✅ recruiter only
//  // candidate

// export default router;



import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  applyToJob,
  getJobsByRecruiter,
  getJobApplications,
  withdrawApplication,
  updateApplication,
  deleteJob,
  updateJob
} from "../controllers/job.controller.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ROUTES
router.post("/", verifyToken, createJob); // recruiter
router.get("/recruiter", verifyToken, getJobsByRecruiter); // recruiter-specific
router.get("/", getAllJobs); // public
router.get("/:id", getJobById); // public
router.post("/:id/apply", verifyToken, applyToJob); // candidate
router.put("/:jobId/apply", verifyToken, updateApplication); // candidate
router.delete("/:jobId/apply", verifyToken, withdrawApplication); // candidate
router.get("/:jobId/applications", verifyToken, getJobApplications); // recruiter

router.delete("/:id", verifyToken, deleteJob); // ✅ recruiter deletes job
router.put("/:id", verifyToken, updateJob);
export default router;

