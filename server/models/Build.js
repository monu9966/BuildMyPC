import mongoose from "mongoose";

const buildSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    components: [
      {
        typeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ComponentType",
        },

        typeName: String,   // CPU / Mouse / Keyboard etc
        componentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Component",
        },

        name: String,
        price: Number,
        image: String,
      }
    ],

    totalPrice: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Build", buildSchema);