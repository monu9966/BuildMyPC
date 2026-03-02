import express from "express";
import User from "../models/User.js";
import { upload } from "../middleware/uploads.js";

const router = express.Router();

/* Upload Profile Photo */
router.post("/upload-photo/:id", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const photoUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: photoUrl },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.log("Upload Error:", err);
    res.status(500).send("Upload error");
  }
});

/* UPDATE PROFILE */
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).send("Error updating profile");
  }
});

export default router;