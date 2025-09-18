import Job from "../models/Job.model.js";
import Application from "../models/Application.model.js";
import User from "../models/User.model.js";
import { sendEmail } from "../utils/mailer.js";

// 📌 POST /api/jobs — Recruiter creates a job
export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, requirements } = req.body;

    if (!title || !description || !location || !salary || !requirements) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      requirements,
      postedBy: req.userId,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: "Job creation failed", message: err.message });
  }
};

// 📌 GET /api/jobs — All jobs for candidates
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name company email");
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs", message: err.message });
  }
};

// 📌 GET /api/jobs/:id — Get single job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name company");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: "Error fetching job", message: err.message });
  }
};

// 📌 POST /api/jobs/:id/apply — Candidate applies
export const applyToJob = async (req, res) => {
  try {
    const { resumeUrl, coverLetter } = req.body;
    if (!resumeUrl || !coverLetter) {
      return res.status(400).json({ error: "Resume and cover letter are required" });
    }

    const job = await Job.findById(req.params.id).populate("postedBy");
    if (!job) return res.status(404).json({ error: "Job not found" });

    const existing = await Application.findOne({ job: job._id, candidate: req.userId });
    if (existing) return res.status(400).json({ error: "Already applied" });

    const application = await Application.create({
      job: job._id,
      candidate: req.userId,
      resumeUrl,
      coverLetter,
    });

    // 📧 Send email to recruiter
    const recruiterEmail = job.postedBy?.email;
    const candidate = await User.findById(req.userId);
    if (recruiterEmail) {
      await sendEmail(
        recruiterEmail,
        `New Application for "${job.title}"`,
        `
          <h2>${candidate.name} applied for ${job.title}</h2>
          <p><strong>Email:</strong> ${candidate.email}</p>
          <p><strong>Cover Letter:</strong> ${coverLetter}</p>
          <a href="${resumeUrl}">📄 View Resume</a>
        `
      );
    }

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to apply", message: err.message });
  }
};

// 📌 GET /api/recruiter/jobs — Jobs created by current recruiter
export const getJobsByRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.userId });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recruiter jobs", message: err.message });
  }
};

// 📌 GET /api/recruiter/jobs/:jobId/applications — All candidates for this job
export const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("candidate", "name email resumeUrl");
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications", message: err.message });
  }
};

// 📌 GET /api/candidate/applications — Candidate's dashboard
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.userId })
      .populate("job", "title company location");
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applied jobs", message: err.message });
  }
};

// 📌 DELETE /api/jobs/:jobId/applications/withdraw — Withdraw
export const withdrawApplication = async (req, res) => {
  try {
    await Application.findOneAndDelete({ job: req.params.jobId, candidate: req.userId });
    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to withdraw application", message: err.message });
  }
};

// 📌 DELETE /api/jobs/:id — Recruiter deletes a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.userId });

    if (!job) {
      return res.status(404).json({ error: "Job not found or unauthorized" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job", message: err.message });
  }
};


// 📌 PUT /api/jobs/:jobId/applications/update — Update Resume/Cover Letter
export const updateApplication = async (req, res) => {
  try {
    const { resumeUrl, coverLetter } = req.body;
    const updated = await Application.findOneAndUpdate(
      { job: req.params.jobId, candidate: req.userId },
      { resumeUrl, coverLetter },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update application", message: err.message });
  }
};

// 📌 PUT /api/jobs/:id — Recruiter updates a job
export const updateJob = async (req, res) => {
  try {
    const { title, description, location, salary, requirements } = req.body;

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.userId }, // Only allow if recruiter owns the job
      { title, description, location, salary, requirements },
      { new: true }
    );

    if (!job) return res.status(404).json({ error: "Job not found or unauthorized" });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: "Failed to update job", message: err.message });
  }
};

