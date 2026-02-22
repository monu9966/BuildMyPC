import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        cpu: Object,
        motherboard: Object,
        ram: Object,
        storage: Object,
        gpu: Object,
        psu: Object,
        cabinet: Object,
        monitor: Object,
        totalPrice: Number,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Cart", cartSchema);
