import express from "express";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. PLACE ORDER
router.post("/cod", protect, async (req, res) => {
  try {
    // support both older and newer address shapes
    const addr = req.body.address || {};
    const addressPayload = {
      name: addr.name || addr.fullName || "",
      phone: addr.phone || "",
      pincode: addr.pincode || "",
      city: addr.city || "",
      state: addr.state || "",
      fullAddress: addr.fullAddress || addr.street || "",
    };

    // basic validation
    if (!req.body.build || !req.body.totalPrice) {
      console.error("Invalid order data", req.body);
      return res.status(400).json({ message: "Build and total price are required" });
    }
    if (!addressPayload.name || !addressPayload.phone || !addressPayload.fullAddress) {
      console.error("Invalid address data", req.body.address);
      return res.status(400).json({ message: "Complete address information is required" });
    }

    const order = await Order.create({
      userId: req.userId, // This comes from the decoded token in your middleware
      build: req.body.build,
      totalPrice: req.body.totalPrice,
      address: addressPayload,
      paymentMethod: "COD",
    });
    res.status(201).json({ message: "Order placed!", order });
  } catch (error) {
    // This console.log will tell you EXACTLY why the 500 error is happening
    console.error("Order Save Error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// 2. GET MY ORDERS
router.get("/myorders", protect, async (req, res) => {
  try {
    // We use req.userId which was attached by your protect middleware
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.get("/admin/all", protect, async (req, res) => {
  try {
    if (req .userRole !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only"});
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders", error: error.message });
  }
});

// 3. UPDATE ORDER STATUS (admin-only)
router.put("/status/:id", protect, async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }

    const { status } = req.body;
    const allowed = ["Pending", "Processing", "Shipped", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
});

export default router;