import { Router } from "express";
const adminRouter = Router();
import { adminModel, bikeModel, helmetModel, bookingModel} from "../models/db.js"
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import adminMiddleWare from "../middlewares/adminMid.js"


dotenv.config();
const JWT_ADMIN  = process.env.JWT_ADMIN_SECRET;



adminRouter.post("/signup",async function (req,res) {
    
    const validedData = z.object({
        email: z.string().min(4).max(40).email(),
        password: z.string().min(6).regex(/[A-Z]/)
                                  .regex(/[a-z]/)
                                  .regex(/[0-9]/)
                                  .regex(/[^A-Za-z0-9]/,),
        name:z.string()
    });

    const parsedDataWithsuccess = validedData.safeParse(req.body);

    if(!parsedDataWithsuccess.success){
        res.json({
            message: "Incorrect format",
            error: parsedDataWithsuccess.error
        })
        return;
    }

    console.log(req.body);

    const { email, password, name} = req.body;

    try{
        const hashedpassword = await bcrypt.hash(password,5);

        const response = await adminModel.create({
            email: email,
            password: hashedpassword,
            name:name
        })

        res.json({
            message: "You are Signed Up"
        })
    }catch(error){
        console.log("Error occurred during admin signup:",error),
        res.status(500).json({
            message: "An error occurred during signup",
            error: error.message
        })
    }
})

adminRouter.post("/signin", async function (req,res) {
  
    const validedData = z.object({
        email:z.string().min(4).max(40).email(),
        password:z.string().min(8).regex(/[A-Z]/)
                                  .regex(/[a-z]/)
                                  .regex(/[0-9]/)
                                  .regex(/[^A-Za-z0-9]/)
    })

    const parsedDataWithsuccess = validedData.safeParse(req.body);

    if(!parsedDataWithsuccess.success){
        res.json({
            message: "Incorrect format",
            error: parsedDataWithsuccess.error
        })
            return;
        }

        const {email, password} = req.body;
        // console.log(req.body);

        try{
             const response = await adminModel.findOne({
                email:email
             })

            //  console.log(response);


             if(!response){
                res.status(403).json({
                    message:"user not found"
                })
                return;
             }

             const passwordMatch = await bcrypt.compare(password, response.password);

            //  console.log(passwordMatch)

            // console.log(response._id.toString());
            // console.log(JWT_ADMIN);

             if(passwordMatch){

                const token = jwt.sign({id: response._id.toString()},JWT_ADMIN)

                res.json({
                    token: token
                })
             }else{
                res.status(403).json({
                    message:"Incorrect creds"
                })
             }
        }catch (error) {

                  console.error("Error during admin signin:", error);

                   res.status(500).json({
                   message: "An error occurred during signin",
                   error: error.message
                });
        }
})

           //       Bike routes

adminRouter.post("/bike",adminMiddleWare, async function(req,res){

    const adminId = req.adminId;

    const {model, type, status, pricePerHour, pricePerDay, pricePerWeek,imageUrl} = req.body;

     console.log(req.body);

    if(!model|| !type|| !status ||!pricePerDay ||!pricePerHour||!pricePerWeek){
        return res.status(403).json({message: "Missing fields"});
    }

    try{
        const newBike = await bikeModel.create({
            model,
            type,
            status: status || "available",
            pricePerDay,
            pricePerHour,
            pricePerWeek,
            imageUrl,
        })

        console.log(newBike);

       return res.json({ message: "bike added", newBike});
    } catch(error){
        console.log("Error in bike post Route");
        res.status(500).json({message: "Failed to add bike", error: error.message})
    }
});

adminRouter.put("/bike",adminMiddleWare,async function(req,res){
    const {bikeId, ...updateData} = req.body;

    if(!bikeId) return res.status(400).json({ message: "bikeId required"});

        try{
            const updated = await bikeModel.findByIdAndUpdate(bikeId, updateData, { new: true});

            res.json({ message: "Bike updated", Bike: updated})
        }catch(error){
            res.status(500).json({ message: "Failed to update", error: error.message })
        };
})


adminRouter.delete("/bike", adminMiddleWare, async (req, res) =>{
    const { bikeId } = req.body;

    if(!bikeId) return res.status(403).json({ message: "Bike ID required"});

    try{
        const deleted = await bikeModel.findByIdAndDelete(bikeId);

        if(!deleted) return res.status(404).json({ message: "Bike not found" });

        const bikes = await bikeModel.find();

        res.json({ message: "Bike deleted", bikes});
    } catch (error){
          res.status(500).json({ msg: "Failed to delete", error: error.message });
    }
});


adminRouter.get("/bikes",adminMiddleWare, async function(req,res){

    try{
        const bikes = await bikeModel.find();

        res.json({message: " All bikes ", bikes: bikes})
    }catch(error){
        res.status(500).json({ msg: "Failed to accessing bikes", error: error.message });
    }
})


adminRouter.post("/helmet",adminMiddleWare, async function (req, res) {
    
    const { model, status, pricePerDay, pricePerHour, pricePerWeek,imageUrl} = req.body;

    if (!model || !pricePerHour || !pricePerDay || !pricePerWeek) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newHelmet = await helmetModel.create({
        model: model,
        status: status || "available",
        pricePerDay: pricePerDay,
        pricePerHour: pricePerHour,
        pricePerWeek: pricePerWeek,
        imageUrl: imageUrl
    })

    res.json({ message: " Helmet added", helmet: newHelmet});
  } catch(error){
    res.status(500).json({ msg: "Failed to add helmet", error:error.message})
  }
});

adminRouter.put("/helmet", adminMiddleWare, async function (req, res) {
    
    const {helmetId, ...updateData} = req.body;

    if(!helmetId) return res.status(400).json({ message: "helmetId required"});

    try{
        const updated = await helmetModel.findByIdAndUpdate(helmetId,updateData);

        if(!updated) return res.status(404).json({ msg: "Helmet not found" });

        res.json({ message: "Helmet updated ", helmet: updated});
    } catch(error){
        res.status(500).json({ message: "Failed to update helmet", error: error.message});
    }
})

adminRouter.delete("/helmet", adminMiddleWare, async (req, res) => {
  const { helmetId } = req.body;
  if (!helmetId) return res.status(400).json({ msg: "helmetId required" });

  try {
    const deleted = await helmetModel.findByIdAndDelete(helmetId);
    if (!deleted) return res.status(404).json({ msg: "Helmet not found" });

    const helmets = await helmetModel.find();
    res.json({ message: "Helmet deleted successfully", helmets });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete helmet", error: err.message });
  }
});


adminRouter.get("/helmets", adminMiddleWare, async (req, res) => {
  try {
    const helmets = await helmetModel.find();
    res.json({ helmets });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch helmets", error: err.message });
  }
});

adminRouter.get("/bookings", adminMiddleWare, async (req, res) => {
  try {
    const bookings = await bookingModel.find()
      .populate("user", "name email")
      .populate("bike", "model type pricePerDay")
      .populate("helmet", "model");
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch bookings", error: error.message });
  }
});


export default adminRouter