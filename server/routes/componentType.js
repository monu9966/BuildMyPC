import express from "express";
import ComponentType from "../models/ComponentType.js";

const router = express.Router();


// GET ALL
router.get("/", async (req, res) => {
  const data = await ComponentType.find() ;
  res.json(data);
});

// ADD
router.post("/", async (req, res) => {
  const { name, icon, order } = req.body;

  const newType = await ComponentType.create({ name, icon, order });
  res.json(newType);
});

router.put("/:id", async (req, res) => {
  const { name, icon, order } = req.body;

  const updatedType = await ComponentType.findByIdAndUpdate(
    req.params.id,
    { name, icon, order },
    { new: true }
  );

  res.json(updatedType);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await ComponentType.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;