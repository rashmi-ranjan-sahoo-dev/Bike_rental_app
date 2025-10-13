import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import bookingRouter from "./routes/bookingRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;
const mongo_url = process.env.MONGO_URL;

app.use("api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/booking",bookingRouter);

async function main() {
    await mongoose.connect(mongo_url);
    app.listen(port, () => console.log('Listeing on port 3000'))
}

main(); 