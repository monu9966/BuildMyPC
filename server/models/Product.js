import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,   // CPU, RAM, Mouse etc
  socket: String,
  ramType: String,
  watt: Number
}, { timestamps: true });

export default mongoose.model("Product", productSchema);