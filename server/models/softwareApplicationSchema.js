import mongoose from "mongoose"


const softwareApplicationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    svg:{
        type:String,
        required:true
    }
})


export const SoftwareApplication=mongoose.model("SoftwareApplication",softwareApplicationSchema);
 