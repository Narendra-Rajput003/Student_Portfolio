import ErrorHandler from "../middleware/error.js";
import {catchAsyncErrors} from "../middleware/catchAsyncErrors.js";
import User from "../models/userSchema.js"



class UserController{

  static register=catchAsyncErrors(async(req,res,next)=>{
    
    
  })
  
}

export default UserController;



