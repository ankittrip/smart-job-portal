// // src/services/api.js
// import axios from "axios";

// // 🔐 Set base URL depending on environment
// const API = axios.create({
//   baseURL: "http://localhost:5000/api", // ✅ Change this if deployed
//   withCredentials: false,
// });

// // 📦 Automatically attach token from localStorage to every request
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Auth
// export const register = (data) => API.post("/auth/register", data);
// export const login = (data) => API.post("/auth/login", data);
// export const getProfile = () => API.get("/users/profile");

// // 📌 Jobs
// export const createJob = (data) => API.post("/jobs", data);
// export const getAllJobs = () => API.get("/jobs");
// export const getJobById = (id) => API.get(`/jobs/${id}`);
// export const applyToJob = (jobId, data) => API.post(`/jobs/${jobId}/apply`, data);
// export const withdrawApplication = (jobId) => API.delete(`/jobs/${jobId}/apply`);
// export const updateApplication = (jobId, data) => API.put(`/jobs/${jobId}/apply`, data);

// // 👤 Recruiter-specific
// export const getJobsByRecruiter = () => API.get("/jobs/recruiter");
// export const getJobApplications = (jobId) => API.get(`/jobs/${jobId}/applications`);

// export default API;


// src/services/api.js
import axios from "axios";

// 🔐 Set base URL depending on environment
const API = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Change this if deployed
  withCredentials: false,
});

// 📦 Automatically attach token from localStorage to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/users/profile");

// 📌 Jobs
export const createJob = (data) => API.post("/jobs", data);
export const getAllJobs = () => API.get("/jobs");
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const applyToJob = (jobId, data) => API.post(`/jobs/${jobId}/apply`, data);
export const withdrawApplication = (jobId) => API.delete(`/jobs/${jobId}/apply`);
export const updateApplication = (jobId, data) => API.put(`/jobs/${jobId}/apply`, data);
export const deleteJob = (jobId) => API.delete(`/jobs/${jobId}`); // ✅ Added deleteJob

// 👤 Recruiter-specific
export const getJobsByRecruiter = () => API.get("/jobs/recruiter");
export const getJobApplications = (jobId) => API.get(`/jobs/${jobId}/applications`);

export default API;
