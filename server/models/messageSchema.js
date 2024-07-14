import mongoose from "mongoose"


const messageShema=mongoose.Schema({
    senderName:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    }


})


export const Message = mongoose.model("Message", messageShema);