import { Router } from "express";
const adminRouter = Router();
import { adminModel, bikeModel, helmetModel} from "../models/db.js"
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import JWT_ADMIN  from process.env.JWT_ADMIN_SECRET;



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
            message: "Incorect format",
            error: parsedDataWithsuccess.error
        })
        return;
    }

    const { email, password, name} = req.body;

    try{
        const hashedpassword = await bcrypt.hash(password,5);

        const response = await adminModel.create({
            email: email,
            password: password,
            name:name
        })

        res.json({
            message: "You are Singed Up"
        })
    }catch(error){
        console.log("Error occure during admin singup:",error),
        res.status(500).json({
            message: "An error occurred during singup",
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
                message:"Incorect format",
                error: parsedDataWithsuccess.error
            })
            return;
        }

        const {email, password} = req.body;

        try{
             const response = await adminModel.findOne({
                email:email
             })

             if(!response){
                res.status(403).json({
                    message:"user not found"
                })
             }

             const passwordMath = bcrypt.compare(password.response.password);

             if(passwordMath){

                const token = jwt.sign({id: response._id.toString(),JWT_ADMIN})

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
