import mongoose from "mongoose";



const skillSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    proficiency:{
        type:Number,
        
    },
    svg:{
        type:String
    }
})

export const Skill = mongoose.model("Skill",skillSchema);