import express from "express";
import Build from "../models/Build.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// middleware to check token
const protect = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: "NO token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
};

// Save Build
router.post("/save", protect, async (req, res) => {
    const build = await Build.create({
        userId: req.userId,
        components: req.body.components,
        totalPrice: req.body.totalPrice,
    });

    res.json(build);
});

// GET MY BUILDS
router.get("/my", protect, async (req, res) => {
  const builds = await Build.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(builds);
});

export default router;