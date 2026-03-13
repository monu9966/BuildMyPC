import express from "express";
import Component from "../models/Component.js";
import multer from "multer";
import path from "path";

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
  try {
    const { type, search, q, category } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;
    const searchQuery = search || q || "";

    const query = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    const total = await Component.countDocuments(query);

    let dataQuery = Component.find(query).sort({ createdAt: -1 });
    if (limit > 0) {
      dataQuery = dataQuery.skip((page - 1) * limit).limit(limit);
    }

    const data = await dataQuery;

    const response = { 
      data,
      total,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      currentPage: page
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching components:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Search alias if needed by frontend
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || req.query.search || "";
    const results = await Component.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    }).limit(20);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Search error" });
  }
});

// Get by ID - must be after /search to not conflict
router.get("/:id", async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }
    res.json(component);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { type, name, price } = req.body;

    if (!type || !name || !price) {
      return res.status(400).json({ message: "Type, Name, and Price are required" });
    }

    const itemData = { ...req.body };

    if (req.file) {
      itemData.image = `/uploads/${req.file.filename}`;
    }

    if (itemData.isBestSeller !== undefined) {
      itemData.isBestSeller = itemData.isBestSeller === "true" || itemData.isBestSeller === true;
    }

    const item = await Component.create(itemData);
    res.status(201).json(item);
  } catch (err) {
    console.error("Create component error:", err);
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
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (updateData.isBestSeller !== undefined) {
      updateData.isBestSeller = updateData.isBestSeller === "true" || updateData.isBestSeller === true;
    }

    const item = await Component.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update error" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const item = await Component.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Component not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete error" });
  }
});

export default router;
