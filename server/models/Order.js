import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true
  },

  // store the customer's chosen PC build(s); can be an object or array so we
  // allow Mixed type rather than strict Object which can reject arrays.
  build: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD",
  },

  address: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    fullAddress: { type: String, required: true },
  },

  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Cancelled"],
    default: "Pending",
  },

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
