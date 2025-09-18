// export default CandidateDashboard;
import React, { useEffect, useState } from "react";
import { getAllJobs, applyToJob } from "../../services/api";
import { useNavigate } from "react-router-dom";

const CandidateDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("❌ Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    setApplying(jobId);
    setError("");
    try {
      await applyToJob(jobId, {
        resumeUrl: "https://your-resume.com/resume.pdf",
        coverLetter: "I am excited to apply for this opportunity.",
      });
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
    } catch (err) {
      setError(err.response?.data?.error || "❌ Application failed.");
    } finally {
      setApplying(null);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6">
      {/* Navbar */}
      <header className="bg-white/70 dark:bg-gray-800/90 backdrop-blur border-b border-white/30 dark:border-gray-700 shadow-md sticky top-0 z-50 rounded-b-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
            <span className="text-xl font-bold text-blue-700 dark:text-blue-400">TalentConnect</span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Welcome, <span className="font-medium">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm bg-white/70 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          ← Go to Home
        </button>
      </div>

      {/* Main Section */}
      <div className="py-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Candidate Dashboard
        </h2>

        {error && (
          <div className="mb-4 px-4 py-2 text-sm text-red-600 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-400 rounded animate-pulse">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-300">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300">No jobs available.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white/70 dark:bg-gray-800/90 border border-white/30 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all backdrop-blur p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{job.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">{job.description}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Location: <span className="font-medium">{job.location || "Remote"}</span>
                </p>
                {job.salary && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Salary: <span className="font-medium">{job.salary}</span>
                  </p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleApply(job._id)}
                  disabled={appliedJobIds.has(job._id) || applying === job._id}
                  className={`mt-5 w-full py-2 text-sm font-semibold rounded-lg transition flex items-center justify-center shadow ${
                    appliedJobIds.has(job._id)
                      ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                  }`}
                >
                  {applying === job._id ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                      </svg>
                      Applying...
                    </>
                  ) : appliedJobIds.has(job._id) ? (
                    "✅ Applied"
                  ) : (
                    "🚀 Apply Now"
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
