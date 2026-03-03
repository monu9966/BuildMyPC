import express from "express";
import Build from "../models/Build.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* =============================
🔐 AUTH MIDDLEWARE
============================= */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* =============================
💾 SAVE BUILD (PRIVATE)
============================= */
// helper to transform a flat map into the array schema expected by Build
function normalizeComponents(input) {
  // if already an array, assume it is correctly formatted
  if (Array.isArray(input)) return input;
  if (!input || typeof input !== "object") return [];

  return Object.entries(input).map(([typeName, item]) => ({
    typeName,
    componentId: item?._id || null,
    name: item?.name || "",
    price: item?.price || 0,
    image: item?.image || "",
  }));
}

router.post("/", protect, async (req, res) => {
  try {
    const { components, totalPrice } = req.body;

    const build = await Build.create({
      userId: req.userId,
      components: normalizeComponents(components),
      totalPrice,
      isPublic: false,
    });

    res.status(201).json(build);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =============================
🔗 SHARE BUILD (PUBLIC)
============================= */
router.post("/share", protect, async (req, res) => {
  try {
    const { components, totalPrice } = req.body;

    const build = await Build.create({
      userId: req.userId,
      components: normalizeComponents(components),
      totalPrice,
      isPublic: true,
    });

    res.json({ id: build._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sharing build" });
  }
});

/* =============================
🌐 VIEW SHARED BUILD
============================= */
router.get("/public/:id", async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);

    if (!build || !build.isPublic)
      return res.status(404).json({ message: "Build not found" });

    res.json(build);
  } catch {
    res.status(404).json({ message: "Build not found" });
  }
});

/* =============================
👤 GET MY BUILDS
============================= */
router.get("/my", protect, async (req, res) => {
  const builds = await Build.find({ userId: req.userId })
    .sort({ createdAt: -1 });

  res.json(builds);
});

/* =============================
👑 ADMIN GET ALL BUILDS
============================= */
router.get("/admin/all", protect, async (req, res) => {
  if (req.userRole !== "admin")
    return res.status(403).json({ message: "Admins only" });

  const builds = await Build.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json(builds);
});

/* =============================
❌ DELETE BUILD
============================= */
router.delete("/:id", protect, async (req, res) => {
  const build = await Build.findById(req.params.id);

  if (!build) return res.status(404).json({ message: "Not found" });

  if (
    build.userId.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await build.deleteOne();
  res.json({ message: "Deleted" });
});

export default router;