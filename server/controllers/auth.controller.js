import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 📌 POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      company: role === "recruiter" ? company : undefined,
    });

    // Generate JWT
    let token;
    try {
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    } catch (err) {
      return res.status(500).json({ error: "Token generation failed", message: err.message });
    }

    // Respond
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company || null,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", message: err.message });
  }
};

// 📌 POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT
    let token;
    try {
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    } catch (err) {
      return res.status(500).json({ error: "Token generation failed", message: err.message });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company || null,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", message: err.message });
  }
};
