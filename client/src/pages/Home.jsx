import React, { useEffect, useState } from "react";
import { getAllJobs } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        // Filter out duplicate jobs (temporary fix for the example data)
        const uniqueJobs = res.data.filter((job, index, self) =>
          index === self.findIndex((j) => j._id === job._id)
        );
        setJobs(uniqueJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs
    .filter((job) => {
      if (filter === "all") return true;
      return job.type === filter;
    })
    .filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase()) ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase())
        )
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0 z-50">

  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
    <Link to="/" className="flex items-center">
      <svg
        className="w-8 h-8 text-blue-600 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span className="text-2xl font-extrabold text-blue-700 tracking-tight">
        TalentConnect
      </span>
    </Link>

    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">
            Hello, {user.name || user.username || "User"}
          </span>

          {/* Dashboard Link */}
          <Link
            to={
              user.role === "recruiter"
                ? "/recruiter/dashboard"
                : "/candidate/dashboard"
            }
            className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
          >
            Dashboard
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      ) : (
        <>
          <Link
            to="/login"
            className="hidden sm:block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Register
          </Link>
        </>
      )}
    </div>
  </div>
</header>


      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Browse thousands of job listings and find the perfect match for your
            skills and experience.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search job title, company, or skills..."
                className="w-full px-5 py-3 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="absolute right-3 top-3 p-1 text-blue-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button
                onClick={() => setSearch("React")}
                className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition"
              >
                React
              </button>
              <button
                onClick={() => setSearch("Node.js")}
                className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition"
              >
                Node.js
              </button>
              <button
                onClick={() => setSearch("Frontend")}
                className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition"
              >
                Frontend
              </button>
              <button
                onClick={() => setSearch("Backend")}
                className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition"
              >
                Backend
              </button>
              <button
                onClick={() => setSearch("Remote")}
                className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition"
              >
                Remote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Filter Section */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {filter === "all"
              ? "All Jobs"
              : `${filter.replace("-", " ")} Jobs`}
            <span className="text-gray-500 text-lg ml-2">
              ({filteredJobs.length})
            </span>
          </h2>
          <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
            {["all", "full-time", "part-time", "remote", "contract"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 text-sm rounded-md capitalize transition ${
                    filter === type
                      ? "bg-white text-blue-600 shadow-sm font-medium"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {type.replace("-", " ")}
                </button>
              )
            )}
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0114 0z"
              ></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No jobs found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {job.title}
                      </h3>
                      {job.company && (
                        <p className="text-gray-600 text-sm mt-1">{job.company}</p>
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.type === "remote"
                          ? "bg-green-100 text-green-800"
                          : job.type === "full-time"
                          ? "bg-blue-100 text-blue-800"
                          : job.type === "part-time"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.type || "Full-time"}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 mb-4 text-sm">
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    <span>{job.location || "Remote"}</span>
                  </div>

                  <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                    {job.description || "No description provided"}
                  </p>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                >
                  View Details
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Featured Companies Section */}
      <section className="bg-gray-50 py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Featured Companies Hiring Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {[
              "TechCorp",
              "DevSolutions",
              "WebCraft",
              "DataSystems",
              "CloudNine",
            ].map((company) => (
              <div
                key={company}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-blue-600">
                    {company.charAt(0)}
                  </span>
                </div>
                <h3 className="font-medium text-gray-800">{company}</h3>
                <p className="text-xs text-gray-500 mt-1">5+ open positions</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                TalentConnect
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Connecting top talent with world-class companies.
              </p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "linkedin", "github"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <span className="sr-only">{social}</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d={`M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z`}
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                For Candidates
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/jobs"
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    Career Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resume-tips"
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    Resume Tips
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                For Employers
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/post-job"
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse-candidates"
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    Browse Candidates
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-500 hover:text-gray-900 text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TalentConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

