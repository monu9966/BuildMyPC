import mongoose from "mongoose";

const buildSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    components: {
        cpu: Object,
        motherboard: Object,
        ram: Object,
        storage: Object,
        gpu: Object,
        psu: Object,
        cabinet: Object,
        monitor: Object,
    },
    
    totalPrice: Number,
}, { timestamps: true });

export default mongoose.model("Build", buildSchema);