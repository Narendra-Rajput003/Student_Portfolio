import {Message} from "../models/messageSchema.js"
import {catchAsyncErrors} from "../middleware/catchAsyncErrors.js"
import ErrorHandler from "../utils/errorHandler.js"
import {getCache,setCache,deletCache} from "../utils/Cache.js"




class messageController{
    static sendMessage=catchAsyncErrors(async(req,res,next)=>{
        const {senderName, subject, message}=req.body;
        if(!senderName || !subject || !message){
            return next(new ErrorHandler("Please fill all the fields", 400))
        }
        const userMessage=await Message.create({
            senderName,
            subject,
            message
        })
        res.status(200).json({
            success:true,
            message:"Message sent successfully",
            userMessage
    })
})

    static getMessage=catchAsyncErrors(async(req,res,next)=>{
        const cacheDetails=await getCache("allMessages");
        if(cacheDetails){
            return res.status(200).json({
                success:true,
                message:"Messages fetched from cache",
                cacheDetails
            })
        }
        const allMessages=await Message.find();
        if(!allMessages){
            return next(new ErrorHandler("No messages found", 404))
        }
        await setCache("allMessages",allMessages);
        res.status(200).json({
            success:true,
            message:"Messages fetched successfully",
            allMessages
        })

    })

    static deleteMessage=catchAsyncErrors(async(req,res,next)=>{
        const {id}=req.params;
        const message=await Message.findById(id);
        if(!message){
            return next(new ErrorHandler("Message not found", 404))
        }
        await message.deleteOne();
        await deletCache("allMessages");
        res.status(200).json({
            success:true,
            message:"Message deleted successfully"
        })
       

    })

}

export default messageController