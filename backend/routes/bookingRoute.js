import express, { Router } from "express";
import { bookingModel, bikeModel, helmetModel
} from "../models/db.js"
import { userMiddlware } from "../middlewares/userMid.js"


const bookingRouter = Router();

bookingRouter.post("/",userMiddlware, async function(req,res){
    try{
        const booking = await bookingModel.create({
            ...req.body,
            user: req.userId,
        })

        await bikeModel.findByIdAndUpdate(req.body.bike, { status: "booked" });
        if(req.body.helmet) await helmetModel.findByIdAndUpdate(req.body.helmet, { status: "booked"});

        res.status(201).json({ msg: "Booking created", booking });
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Error creating booking", error})
    }
})