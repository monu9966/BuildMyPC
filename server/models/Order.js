import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    components: Object,
    totalPrice: Number,
    paymentMethod: String,
    status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
