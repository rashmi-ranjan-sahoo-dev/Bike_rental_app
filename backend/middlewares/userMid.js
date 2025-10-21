// backend/middleware/userMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

const JWT_USER = process.env.JWT_USER_SECRET;

 const userMiddleWare = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

//   console.log(token);

  try {
    const decoded = jwt.verify(token,JWT_USER);
    // console.log(decoded)
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default userMiddleWare;
