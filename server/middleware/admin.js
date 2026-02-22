import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, "SECRET_KEY");

    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    req.user = decoded;
    next();

  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};