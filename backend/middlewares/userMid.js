require('dotenv').config();

const jwt = require("jsonwebtoken");
import JWT_USER from process.env.JWT_USER_SECRET;

const userMiddleWare = ( req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];

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

module.exports = {
    userMiddleWare
}