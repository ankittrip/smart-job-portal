import React, { useState } from "react";

const RecruiterForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    requirements: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, description, location, salary, requirements } = formData;

    if (!title || !description || !location || !salary || !requirements) {
      alert("Please fill in all fields.");
      return;
    }

    if (isNaN(Number(salary))) {
      alert("Please enter a valid salary.");
      return;
    }

    const jobData = {
      ...formData,
      requirements: requirements.split(",").map((req) => req.trim()),
    };

    onSubmit(jobData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Job Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
          rows="4"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Salary</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="e.g. 12 LPA"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Requirements (comma-separated)
        </label>
        <input
          type="text"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
          placeholder="e.g. React, Node.js, MongoDB"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Posting..." : "Post Job"}
      </button>
    </form>
  );
};

export default RecruiterForm;
