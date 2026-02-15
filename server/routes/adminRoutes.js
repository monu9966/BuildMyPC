import express from "express";
import User from "../models/User.js";
import Build from "../models/Build.js";

const router = express.Router();

// GET all users
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// DELETE user
router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// GET all builds
router.get("/builds", async (req, res) => {
  const builds = await Build.find().populate("userId", "name email");
  res.json(builds);
});

// DELETE build
router.delete("/builds/:id", async (req, res) => {
  await Build.findByIdAndDelete(req.params.id);
  res.json({ message: "Build deleted" });
});

router.get("/stats", async (req,res)=>{
  const users = await User.countDocuments();
  const builds = await Build.countDocuments();
  const components = await Component.countDocuments();

  res.json({ users, builds, components });
});


export default router;
