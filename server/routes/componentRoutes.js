import express from "express";
import Component from "../models/Component.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Component.find();
  res.json(data);
});

// ADD
router.post("/", async (req, res) => {
  const { type, name, price } = req.body;

  if (!type || !name || !price) {
    return res.status(400).json({ message: "All fields required" });
  }

  const item = await Component.create({
    type,
    name,
    price,
  });
  
  res.json(item);
});

//Update
router.put("/:id", async (req, res) => {
  const item = await Component.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(item);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Component.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
