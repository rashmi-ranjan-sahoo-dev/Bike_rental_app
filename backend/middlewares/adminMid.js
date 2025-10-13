
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
const JWT_ADMIN = process.env.JWT_ADMIN_SECRET;

const adminMiddleWare = (req,res,next) =>{
     const token = req.headers.authorization?.split(" ")[1];
    
    const decoded =  jwt.verify(token,JWT_ADMIN);

    if(decoded){
      req.adminId = decoded.id;

      next();
    }else{
        res.status(403).json({
            message:"you are not signed in"
        })
    }

}

export default adminMiddleWare;