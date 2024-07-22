import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../middleware/error";
import {TimeLine} from "../models/timelineSchema.js"
import { getCache,setCache } from "../utils/Cache.js";


class TimeLineController{
    static createTimeLine=catchAsyncErrors(async(req,res,next)=>{
        const {title,description,from , to }=req.body;

        //check if all fields are filled
        if(!title || !description || !from || !to){
            return next(new ErrorHandler("Please fill all the fields",400));
        }

        const Newtimeline=await TimeLine.create({
            title,
            description,
            timeline:{
                from,
                to
            }
        })
        res.status(201).json({
            success:true,
            message:"Timeline created successfully",
            timeline:Newtimeline
        })



    })

    static deleteTimeLine=catchAsyncErrors(async(req,res,next)=>{
        const {id}=req.params;
        const timeline=await TimeLine.findById(id);
        if(!timeline){
            return next(new ErrorHandler("Timeline not found",404));
        }
        await timeline.deleteOne();
        res.status(200).json({
            success:true,
            message:"Timeline deleted successfully",
            timeline
        })
    })
    static getAllTimeLine=catchAsyncErrors(async(req,res,next)=>{
        
        const cacheDetails=await getCache("getAllTimeLine");
        if(cacheDetails){
            return res.status(200).json({
                success:true,
                message:"Timeline fetched from cache",
                timeline:cacheDetails
            })
        }
        const timeline=await TimeLine.find();
        await setCache("getAllTimeLine",timeline);
        res.status(200).json({
            success:true,
            message:"Timeline fetched successfully",
            timeline
        })

    })
}


export default TimeLineController;

