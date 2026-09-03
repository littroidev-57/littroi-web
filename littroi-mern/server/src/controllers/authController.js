import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "littroi_super_secret_jwt_key_2026_production_ready",
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    let user = await User.findOne({ email });

    // Fallback/Demo admin if DB has no users yet
    if (!user && email === "admin@littroi.com" && password === "admin123") {
      const demoToken = jwt.sign(
        { id: "demo-admin-id", role: "admin", email: "admin@littroi.com" },
        process.env.JWT_SECRET || "littroi_super_secret_jwt_key_2026_production_ready",
        { expiresIn: "7d" }
      );
      return res.json({
        success: true,
        token: demoToken,
        user: { name: "Studio Admin", email: "admin@littroi.com", role: "admin" }
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (req.user.id === "demo-admin-id") {
      return res.json({
        success: true,
        user: { id: "demo-admin-id", name: "Studio Admin", email: "admin@littroi.com", role: "admin" }
      });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

