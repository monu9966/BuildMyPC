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
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
    },

    brand: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    cores: {
      type: Number,
    },

    threads: {
      type: Number,
    },

    image: {
      type: String,
      default: "",
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    specs: Object,
  },
  { timestamps: true },
);

export default mongoose.model("Component", componentSchema);
