import User from "../models/User.model.js";
import Application from "../models/Application.model.js";

// 📌 GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to get profile", message: err.message });
  }
};

// 📌 PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile", message: err.message });
  }
};


export const getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.userId }).populate("job");
    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications", message: err.message });
  }
};
