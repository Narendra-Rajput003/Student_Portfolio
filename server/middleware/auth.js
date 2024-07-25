import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";


export const isAuthenticate=catchAsyncErrors(async(req,res,next)=>{
    const token=req.cookie;
    if(!token){
        return next(new ErrorHandler("User not Authenticated!", 400))
    }
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await User.findById(decode.id);
    next();
})