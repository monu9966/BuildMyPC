import express from "express";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/cod", protect, async (req, res) => {
    const order = await Order.create({
        userId: req.userId,
        components: req.body.components,
        totalPrice: req.body.totalPrice,
        paymentMethod:  "COD",
    });

    res.json({ message: "Order placed!", order });
});

router.get("/my", protect, async (req, res) => {
    const orders = await Order.find({ userId: req.userId });
    res.json(orders);
});

export default router;