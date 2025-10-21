import express from "express";
import { bookingModel } from "../models/db.js"; // adjust to your model path
import userMiddleWare from "../middlewares/userMid.js";

const bookingRouter = express.Router();

bookingRouter.post("/", userMiddleWare, async (req, res) => {
  // console.log("=== Booking Request Received ===");
  // console.log("User ID:", req.userId);
  // console.log("Request Body:", req.body);

  const { bike, helmet, pickupDate, pickupTime, dropDate, dropTime, totalPrice } = req.body;
  const user = req.userId;

  try {
    // ✅ Validate required fields
    if ( !pickupDate || !pickupTime || !dropDate || !dropTime || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Create booking in DB
    const booking = await bookingModel.create({
      user,
      bike: bike ?? null,
      helmet: helmet ?? null, // default to null
      pickupDate,
      pickupTime,
      dropDate,
      dropTime,
      totalPrice,
      status: "Pending", // optional
    });

    console.log(booking);
    console.log(booking._id.toString())
   
    res.json({ message: "Booking successful!"})
    

  } catch (error) {
    // console.error("❌ Booking failed:", error.message);
    // res.status(500).json({ message: "Internal server error", error: error.message });
    console.error(error);
  }
});

export default bookingRouter;
