import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CandidateForm = ({ onSubmit, isLoading = false }) => {
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      console.error("Invalid URL:", err.message);
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!resumeUrl || !coverLetter) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isValidUrl(resumeUrl)) {
      alert("Please enter a valid Resume URL.");
      return;
    }

    onSubmit({
      resumeUrl: resumeUrl.trim(),
      coverLetter: coverLetter.trim(),
    });

    setResumeUrl("");
    setCoverLetter("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Navbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          TalentConnect
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-700">
              Welcome, <strong>{user.name || "User"}</strong>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 🔹 Application Form */}
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Apply for this Position
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume URL</label>
            <input
              type="url"
              placeholder="https://example.com/resume.pdf"
              className="w-full border px-3 py-2 rounded mt-1"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
            <textarea
              placeholder="Why are you a good fit for this job?"
              className="w-full border px-3 py-2 rounded mt-1"
              rows="5"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;
