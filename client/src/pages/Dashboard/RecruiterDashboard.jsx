import React, { useEffect, useState } from "react";
import { createJob, getJobsByRecruiter, deleteJob } from "../../services/api";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    requirements: "",
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getJobsByRecruiter();
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const jobData = {
        ...form,
        requirements: form.requirements
          ? form.requirements.split(",").map((r) => r.trim())
          : [],
      };
      await createJob(jobData);
      setForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        requirements: "",
      });
      setEditingJobId(null);
      fetchJobs();
    } catch (err) {
      console.error("Create job error:", err);
      setError(err.response?.data?.error || "Failed to create job");
    }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      requirements: job.requirements.join(", "),
    });
    setEditingJobId(job._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id);
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job:", err);
      setError("Failed to delete job.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans">
      <header className="bg-white/80 dark:bg-gray-800/90 backdrop-blur sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10c0 1.1.9 2 2 2h14a2 2 0 002-2V7"
              />
            </svg>
            <span className="text-xl font-bold text-green-700 dark:text-green-400">
              TalentConnect
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome, <span className="font-medium">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          type="button"
          className="mb-6 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          ← Go to Home
        </button>

        <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-white/30 dark:border-gray-700 transition">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            {editingJobId ? "Edit Job" : "Post a New Job"}
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300 rounded shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <textarea
              name="description"
              placeholder="Job Description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <input
              type="text"
              name="salary"
              placeholder="Salary"
              value={form.salary}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <input
              type="text"
              name="requirements"
              placeholder="Requirements (comma separated)"
              value={form.requirements}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {editingJobId ? "Update Job" : "Create Job"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Your Posted Jobs
          </h2>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No jobs posted yet.</p>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li
                  key={job._id}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-md p-6 transition hover:shadow-lg"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{job.description}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {job.location} – {job.salary}
                  </p>
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.requirements.map((req, i) => (
                        <span
                          key={i}
                          className="bg-gray-200 dark:bg-gray-600 text-sm px-3 py-1 rounded-full text-gray-800 dark:text-gray-200"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  )}
                 <div className="flex flex-wrap gap-3 mt-5">
  <button
    type="button"
    onClick={() => handleEdit(job)}
    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition"
    aria-label={`Edit job ${job.title}`}
  >
    ✏️ Edit
  </button>
  <button
    type="button"
    onClick={() => handleDelete(job._id)}
    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition"
    aria-label={`Delete job ${job.title}`}
  >
    🗑️ Delete
  </button>
  <button
    type="button"
    onClick={() => navigate(`/recruiter/jobs/${job._id}/applications`)}
    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 transition"
    aria-label={`View applications for job ${job.title}`}
  >
    📄 View Applications
  </button>
</div>

                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
