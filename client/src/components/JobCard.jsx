// src/components/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom"; 

const JobCard = ({
  job,
  userRole,
  onApply,
  onWithdraw,
  onEdit,
  onDelete,
  isCompact = false,
  isApplied = false,
}) => {
  return (
    <div
      className={`border rounded-xl shadow-md p-4 transition-all hover:shadow-lg ${
        isCompact ? "max-w-md" : "w-full"
      }`}
    >
      <h3 className="text-xl font-semibold text-blue-700">{job.title || "Untitled Job"}</h3>

      {!isCompact && (
        <>
          <p className="text-gray-600 mt-1">{job.description || "No description provided."}</p>
          <p className="text-sm text-gray-500 mt-2">
            Location: {job.location || "N/A"} | Salary: {job.salary || "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            Posted by: {job.postedBy?.name || "Unknown"}
          </p>
          {job.createdAt && (
            <p className="text-xs text-gray-400">
              Posted on: {new Date(job.createdAt).toLocaleDateString()}
            </p>
          )}
        </>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <Link
          to={`/jobs/${job._id}`}
          title="View Job Details"
          aria-label={`View details for ${job.title}`}
          className="text-sm bg-gray-100 px-3 py-1 rounded border hover:bg-gray-200"
        >
          View Details
        </Link>

        {/* Candidate Actions */}
        {userRole === "candidate" && (
          !isApplied ? (
            <button
              onClick={() => onApply(job._id)}
              className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
            >
              Apply
            </button>
          ) : (
            <button
              onClick={() => onWithdraw(job._id)}
              className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600"
            >
              Withdraw
            </button>
          )
        )}

        {/* Recruiter Actions */}
        {userRole === "recruiter" && (
          <>
            <button
              onClick={() => onEdit(job)}
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this job?")) {
                  onDelete(job._id);
                }
              }}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;
