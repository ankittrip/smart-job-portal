import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetails from "./pages/JobDetails";
import NotFound from "./pages/NotFound"; // ✅ Now imported

import CandidateDashboard from "./pages/Dashboard/CandidateDashboard";
import RecruiterDashboard from "./pages/Dashboard/RecruiterDashboard";
import ViewApplications from "./pages/Dashboard/ViewApplications";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      {/* Dashboards */}
      <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
      <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      <Route path="/recruiter/jobs/:jobId/applications" element={<ViewApplications />} />

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
