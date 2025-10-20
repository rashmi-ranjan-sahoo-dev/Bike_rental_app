import express from "express";
import { bookingModel } from "../models/db.js";
import  userMiddleware  from "../middlewares/userMid.js"


const bookingRouter = express.Router();

bookingRouter.post("/booking", userMiddleware, async (req, res) => {
  try {
    const { bike, helmet, pickupDate, pickupTime, dropDate, dropTime, totalPrice } = req.body;

    if (!pickupDate || !pickupTime || !dropDate || !dropTime || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(req.body);

    const booking = new bookingModel({
      user: req.userId,
      bike,
      helmet,
      pickupDate,
      pickupTime,
      dropDate,
      dropTime,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default bookingRouter ;