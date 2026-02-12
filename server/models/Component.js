import mongoose from "mongoose";

const componentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    // Optional fields
    socket: {
      type: String,
      default: "",
    },

    ramType: {
      type: String,
      default: "",
    },

    watt: {
      type: Number,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    specs: Object,
  },
  { timestamps: true },
);

export default mongoose.model("Component", componentSchema);
