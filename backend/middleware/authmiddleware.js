import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const authorize = (...roles)=>{

    return (req,res,next)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({
                success:false,
                message:"user is not authorize to access this role"
            
            })
        }
        next();
    }
}

export const protect = async(req,res,next)=>{
    
    try {
    const token = req.headers.authorization?.split(" ")[1]
   

    if(!token){
        return res.status(401).json({message:"No token is provided Authorization Denied"})
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    
    
    req.user = await User.findById(decoded.userId).select("-password");
  


    if(!req.user){
        return res.status(400).json({message:"No user with that token"})
    }
    next();

    } catch (error) {
        console.log("authmiddleware not working",error.message);
        res.status(400).json({
            success:false,
            message:"not authorized , token expire or failed"
        })
    }
}