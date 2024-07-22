import ErrorHandler from "../middleware/error.js";
import {catchAsyncErrors} from "../middleware/catchAsyncErrors.js";
import User from "../models/userSchema.js"
import {imageUploader} from "../utils/imageUploader.js"
import zod from "zod"


const signUpdata=zod.object({
  fullName:zod.string().min(3).max(30),
    email:zod.string().email(),
    password:zod.string().min(6).max(20),
    phone:zod.string().min(10).max(10),
    aboutMe:zod.string().min(10).max(100),
    avatar:zod.string(),
    resume:zod.string(),
    githubURL:zod.string(),
    instagramURL:zod.string(),
    linkedlnURL:zod.string(),
    twitterURL:zod.string(),
})

class UserController{

  static register=catchAsyncErrors(async(req,res,next)=>{

    if(!req.files || Object.keys(req.files).length==0){
      return next(new ErrorHandler("Please upload a file",400));
    }

    
    const {fullName,email,password,phone,aboutMe,githubURL,instagramURL,linkedlnURL,twitterURL}=signUpdata.parse(req.body);
    const avatar=req.files.avatar;
    const resume=req.files.resume;
    
    // all fields are required
    if(!fullName || !email || !password || !phone || !aboutMe || !githubURL || !instagramURL || !linkedlnURL || !twitterURL){
      return next(new ErrorHandler("Please fill all the fields", 400));
    }
    // check if user already exists
    const user=await User.findOne({
      $or:[
        {fullName},
        {email}
      ]
    })

    if(user)  return next(new ErrorHandler("User already exists",400));

    const [avatarUpload,resumeUpload]=await Promise.all([
      imageUploader(avatar,process.env.FOLDER_NAME),
      imageUploader(resume,process.env.FOLDER_NAME),
     ]);

    const createUser=new User({
      fullName,
      email,
      password,
      phone,
      aboutMe,
      githubURL,
      instagramURL,
      linkedlnURL,
      twitterURL,
      avatar:avatarUpload.secure_url,
      resume:resumeUpload.secure_url,
    });
    await createUser.save();
      res.status(201).json({
        success:true,
        message:"User created successfully",
        user:createUser,
      })
      
    
  })


  static login =catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
      return next(new ErrorHandler("Please enter email and password",400));
    }
    const user=await User.findOne({email});
    if(!user){
      return next(new ErrorHandler("User not found",404));
    }
    const isMatch=await user.com(password);
    if(!isMatch){
      return next(new ErrorHandler("Incorrect password",400));
    }
    const token=await user.getJWTToken();
    res.status(200).json({
      success:true,
      message:"User logged in successfully",
      token,
      user,
    })
  })
  
}

export default UserController;



