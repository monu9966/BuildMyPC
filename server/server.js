import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import buildRoutes from "./routes/buildRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import componentRoutes from "./routes/componentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("JWT Secret Check:", process.env.JWT_SECRET);
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/builds", buildRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/components", componentRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));