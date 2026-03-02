import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    image: String,
    name: String,
    icon: String,
    description: String,
    orders: Number,
    components: [{ type: mongoose.Schema.Types.ObjectId, ref: "Component" }],
}, { timestamps: true })

export default mongoose.model("Category", categorySchema);