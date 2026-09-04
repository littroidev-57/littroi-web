import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "littroi_super_secret_jwt_key_2026_production_ready",
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user);
    const isProduction = process.env.NODE_ENV === "production";

    // Set HTTP-accessible cookie for 30 days
    res.cookie("littroi_token", token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("littroi_token", {
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  });
  res.json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
