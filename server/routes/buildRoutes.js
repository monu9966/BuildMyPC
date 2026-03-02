import express from "express";
import Build from "../models/Build.js";
import jwt from "jsonwebtoken";

const router = express.Router();


// =============================
// 🔐 AUTH MIDDLEWARE
// =============================
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Expect: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};


// =============================
// 💾 SAVE BUILD
// =============================
router.post("/", protect, async (req, res) => {
  try {
    const { components, totalPrice } = req.body;

    if (!components || !totalPrice) {
      return res.status(400).json({
        message: "Components and total price required",
      });
    }

    const build = await Build.create({
      userId: req.userId,
      components,
      totalPrice,
    });

    res.status(201).json(build);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
// 👤 GET MY BUILDS
// =============================
router.get("/my", protect, async (req, res) => {
  try {
    const builds = await Build.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(builds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
// 👑 GET ALL BUILDS (ADMIN)
// =============================
router.get("/admin/all", protect, async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const builds = await Build.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(builds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
// ❌ DELETE BUILD
// =============================
router.delete("/:id", protect, async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);

    if (!build) {
      return res.status(404).json({ message: "Build not found" });
    }

    // Allow owner or admin
    if (
      build.userId.toString() !== req.userId &&
      req.userRole !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await build.deleteOne();

    res.json({ message: "Build deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
export default router;