import { userModel, bookingModel } from "../models/db.js";
import { z } from "zod";
import bcrypt from "bcrypt"
import userMiddleWare from "../middlewares/userMid.js"
import { Router } from "express";
import jwt from "jsonwebtoken";


import dotenv from "dotenv";
dotenv.config(); // Loads .env file


const JWT_USER = process.env.JWT_USER_SECRET;

const userRouter = Router();

userRouter.post("/signup", async function (req, res) {
  const validedData = z.object({
    email: z.string().min(4).max(40).email(),
    password: z
      .string()
      .min(6)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    name: z.string(),
    phone: z.string().min(10)
  });

  const parsedDataWithsuccess = validedData.safeParse(req.body);

  if (!parsedDataWithsuccess.success) {
    return res.status(400).json({
      message: "Incorrect format",
      error: parsedDataWithsuccess.error,
    });
  }

  console.log(req.body);

  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 5);

    await userModel.create({
      name,
      email,
      password: hashedpassword,
      phone,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});



userRouter.post("/signin", async function (req, res) {
  const validatedData = z.object({
    email: z.string().min(4).max(40).email(),
    password: z.string()
      .min(6)
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number")
  });

  const parsedDataWithSuccess = validatedData.safeParse(req.body);
  console.log(req.body);

  if (!parsedDataWithSuccess.success) {
    return res.status(400).json({
      message: "Incorrect format",
      error: parsedDataWithSuccess.error,
    });
  }

  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_USER);

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Signin backend error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});


userRouter.get("/bookings", userMiddleWare, async function (req, res) {
   try {
    const bookings = await bookingModel.find({ user: req.userId });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

export default userRouter;