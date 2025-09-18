import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobApplications } from "../../services/api";

const ViewApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getJobApplications(jobId);
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white/70 dark:bg-gray-800/90 backdrop-blur-md border border-white/30 dark:border-gray-700 rounded-2xl shadow-2xl p-8 transition-all duration-300">
        <button
          onClick={() => navigate("/recruiter/dashboard")}
          className="mb-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Applications for Job
        </h2>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading applications...</p>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300 p-4 rounded mb-6 shadow-sm">
            {error}
          </div>
        ) : applications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No applications yet.</p>
        ) : (
          <ul className="space-y-6">
            {applications.map((app) => (
              <li
                key={app._id}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 p-6 transition hover:shadow-lg"
              >
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {app.candidate.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{app.candidate.email}</p>
                <p className="mt-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  <strong>Cover Letter:</strong> {app.coverLetter || "No cover letter provided."}
                </p>
                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-700 dark:hover:text-blue-500 transition"
                  >
                    📄 View Resume
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewApplications;
