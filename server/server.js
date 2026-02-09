import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import buildRoutes from "./routes/buildRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();
console.log("JWT Secret Check:", process.env.JWT_SECRET); // Should print your secret, not 'undefined'
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/builds", buildRoutes);

app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));