import express from "express";
import Component from "../models/Component.js";
import multer from "multer";
import path from "path";

// local img upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/", async (req, res) => {
  const { type } = req.query;

  let filter = {};
  if (type) {
    filter.type = type;
  }

  const data = await Component.find(filter);
  res.json(data);
});

// ADD component with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { type, name, price, socket, ramType, watt } = req.body;

    if (!type || !name || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    // image path
    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const item = await Component.create({
      type,
      name,
      price,
      socket,
      ramType,
      watt,
      image,
    });

    res.json(item);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Update
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const item = await Component.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Update error" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  await Component.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
