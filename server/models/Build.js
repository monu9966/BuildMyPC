import mongoose from "mongoose";

const buildSchema = new mongoose.Schema(
  {
    /* OWNER */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* BUILD INFO */
    title: {
      type: String,
      default: "My Custom PC Build",
    },

    description: String,

    /* SHARE BUILD */
    isPublic: {
      type: Boolean,
      default: false,
    },

    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },

    /* COMPONENTS */
    components: [
      {
        typeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ComponentType",
        },

        typeName: String,

        componentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Component",
        },

        name: String,
        price: Number,
        image: String,
      }
    ],

    /* PRICE */
    totalPrice: {
      type: Number,
      required: true,
    },

    /* EXTRA FEATURES */
    compatibilityStatus: {
      cpuMotherboard: Boolean,
      ramMotherboard: Boolean,
      gpuPsu: Boolean,
    },

    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Build", buildSchema);