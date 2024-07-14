import mongoose from "mongoose";

const projectSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ProjectBanner:{
        type:String,
        required:true
    },
    gitRepo:{
        type:String,
        required:true
    },
    projectLink:{
        type:String,
        required:true
    },
    technologies:{
        type:String,
        required:true
    },
})

export const Project=mongoose.model("Project",projectSchema);