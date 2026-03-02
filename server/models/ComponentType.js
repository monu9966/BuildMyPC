import mongoose from "mongoose";

const componentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("ComponentType", componentTypeSchema);