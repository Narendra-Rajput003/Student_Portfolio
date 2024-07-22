import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    Phone:{
        type:String,
        required:true
    },
    aboutMe:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    githubURL:{
        type:String, 
    },
    instragramURL:{
        type:String,
    },
    linkedlnURL:{
        type:String,
    },
    twitterURL:{
        type:String,
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordExpire:{
        type:String,
    }
})

export const User=mongoose.model("User",userSchema);

