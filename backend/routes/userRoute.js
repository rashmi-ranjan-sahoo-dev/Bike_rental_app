import { Router } from "express";
const userRouter = Router();
import { userModel,bookingModel } from "../models/db.js"
import { email, z } from "zod";
const bcrypt = require("bcrypt");
import JWT_USER from process.env.JWT_USER_SECRET;
import userMiddleWare from "../middlewares/userMid.js"


userRouter.post("/signup", async function(req,res){

    const validedData = z.object({
         email: z.string().min(4).max(40).email(),
        password: z.string().min(6).regex(/[A-Z]/)
                                  .regex(/[a-z]/)
                                  .regex(/[0-9]/)
                                  .regex(/[^A-Za-z0-9]/,),
        name:z.string(),
        phone:z.number()
    })

    const parsedDataWithsuccess = validedData.safeParse(req.body);

    if(!parsedDataWithsuccess.success){
        res.json({
            message: "Incorect format",
            error: parsedDataWithsuccess.error
        })
        return;
    }

   try{
     const { name, email, password, phone } = req.body;

    if( !name || !emial || !password){
        return res.status(400).json({ message: "please fill all required fields" });
    }

    const existingUser = await userModel.findOne({ email });

    if(existingUser){
        return res.status(400).json({ message: "User already exists"});
    }

    const hashedpassword = await bcrypt.hash(password,5);

    const newUser = userModel.create({
        name:name,
        email:email,
        password: hashedpassword,
        phone:phone
    });


    return res.status(201).json({ message: "User registered successfully" });
    
   } catch(error){
    return res.status(500).json({message: "Serve error", error});
   }
})


userRouter.post("/login", async function(req, res){
    const validedData = z.object({
         email: z.string().min(4).max(40).email(),
        password: z.string().min(6).regex(/[A-Z]/)
                                  .regex(/[a-z]/)
                                  .regex(/[0-9]/)
                                  .regex()
    })

    const parsedDataWithsuccess = validedData.safeParse(req.body);

    if(!parsedDataWithsuccess.success){
        res.json({
            message: "Incorect format",
            error: parsedDataWithsuccess.error
        })
        return;
    }
    try{
        const { email, password } = req.body;

        const user = await userModel.findOne({email})

        if(!user) return res.status(404).json({ msg: "user not found"});

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if(!passwordMatch) return res.status(400).json({ message: "Invalid credentials"});

        const token = jwt.sign({ userId: user._id }, process.env.JWT_USER)

        return res.status(200).json({
            message: "Login successful",
            token:token
        })   
    } catch (error) {
        return res.status(500).json({ message: "Sever error", error});
    }
})

userRouter.get("/bookeings",userMiddleWare, async function () {
        try{
            const bookeings = await bookingModel.find( {user: req.userId})
            return res.status(200).json(bookeings);
        }catch(error){
            return res.status(500).json({ message: "Server error", error });
        }
})

module.exports = {
    userRouter
}