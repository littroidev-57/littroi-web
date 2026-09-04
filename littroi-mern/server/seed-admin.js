/**
 * Littroi Admin Seeder
 * Creates a real admin user in MongoDB so the Admin panel
 * can authenticate with a proper JWT token.
 * 
 * Run: node seed-admin.js
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/littroi_db";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, default: "admin" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB:", MONGO_URI);

    const existing = await User.findOne({ email: "admin@littroi.com" });
    if (existing) {
      console.log("⚠️  Admin user already exists:", existing.email);
      console.log("   Role:", existing.role);
      console.log("   ID:", existing._id.toString());
      console.log("\n👉 Login with: admin@littroi.com / admin123");
      process.exit(0);
    }

    const hashed = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Littroi Studio Admin",
      email: "admin@littroi.com",
      password: hashed,
      role: "admin"
    });

    console.log("🎉 Admin user created successfully!");
    console.log("   Name:", admin.name);
    console.log("   Email:", admin.email);
    console.log("   Role:", admin.role);
    console.log("   ID:", admin._id.toString());
    console.log("\n👉 Login at: http://localhost:5173/admin");
    console.log("   Email: admin@littroi.com");
    console.log("   Password: admin123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder failed:", err.message);
    process.exit(1);
  }
}

seedAdmin();
