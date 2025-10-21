import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

// ✅ Make sure the secret matches the one used in jwt.sign()
const JWT_ADMIN = process.env.JWT_ADMIN_SECRET; 

const adminMiddleWare = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    // console.log("Token received:", token);

    // ✅ Verify token using the same secret
    const decoded = jwt.verify(token, JWT_ADMIN);

    console.log(decoded.id)

    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res.status(403).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export default adminMiddleWare;
