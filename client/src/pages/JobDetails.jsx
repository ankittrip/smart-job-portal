import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById, applyToJob } from "../services/api";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const res = await getJobById(id);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
        setStatus("❌ Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      await applyToJob(id, { resumeUrl, coverLetter });
      setStatus("✅ Application submitted successfully!");
      setResumeUrl("");
      setCoverLetter("");
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.response?.data?.error || "Failed to submit application"}`);
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Unable to load job details
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen p-6 max-w-5xl mx-auto
        bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50
        dark:bg-gray-900
        transition-colors duration-500
      "
    >
      {/* Job Overview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{job.title}</h1>
              <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{job.location}</span>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300 text-xs font-semibold px-2.5 py-0.5 rounded">
              {job.type || "Full-time"}
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Job Description</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.skills?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Apply for this position</h2>

          <form onSubmit={handleApply} className="space-y-6">
            <div>
              <label
                htmlFor="resumeUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Resume URL
              </label>
              <input
                id="resumeUrl"
                type="url"
                placeholder="https://drive.google.com/your-resume"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Link to your resume (Google Drive, Dropbox, GitHub, etc.)
              </p>
            </div>

            <div>
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                rows="6"
                placeholder="Explain why you're a good fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isApplying}
              className={`w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-200 ${
                isApplying ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isApplying ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>

            {status && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  status.startsWith("✅")
                    ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
