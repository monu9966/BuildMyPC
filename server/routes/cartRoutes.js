import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  const { userId, build } = req.body;

  let cart = await Cart.findOne({ userId });

  if (cart) {
    cart.items.push(build);
    await cart.save();
  } else {
    cart = await Cart.create({
      userId,
      items: [build],
    });
  }

  res.json(cart);
});

router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart);
});

export default router;
