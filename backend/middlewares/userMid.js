import dotenv from "dotenv"
dotenv.config();

import  jwt from "jsonwebtoken";
const JWT_USER = process.env.JWT_USER_SECRET;

const userMiddleWare = ( req,res,next) => {
    const token =  req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token,JWT_USER);

    if(decoded){
        req.userId = decoded.id;

        next();
    }else{
       res.status(403).json({
        message: "You are not signed in"
       })
    }
}

export default userMiddleWare;