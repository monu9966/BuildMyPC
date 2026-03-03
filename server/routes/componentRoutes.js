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
    const { type } = req.query;
    const page = Number(req.query.page) || 1;
    // allow limit=0 to mean no limit (return everything)
    const rawLimit = req.query.limit !== undefined ? Number(req.query.limit) : 5;
    const limit = rawLimit;
    const search = req.query.search || "";
    const category = req.query.category || "";

    const query = {
      name: { $regex: search, $options: "i" },
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
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
    if (limit && limit > 0) {
      dataQuery = dataQuery.skip((page - 1) * limit).limit(limit);
    }

    const data = await dataQuery;

    const response = { data };
    if (limit && limit > 0) {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { type, name, price, socket, ramType, watt } = req.body;

    if (!type || !name || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

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
