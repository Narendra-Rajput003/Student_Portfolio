import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import {imageUploader} from "../utils/imageUploader.js"
import ErrorHandler from "../middleware/error.js";
import {getCache,setCache} from "../utils/Cache.js"
import { get } from "mongoose";
class SoftwareApplicationController{

    static createSoftwareApplication=catchAsyncErrors(async(req,res,next)=>{
        const {name}=req.body;
        const svg=req.file.svg;

        if(!name || !svg){
            return next(new ErrorHandler("Please fill all the fields",400));
        }

        const image=await imageUploader(svg,process.env.FOLDER_NAME);
        const softwareApplication=await SoftwareApplication.create({
            name,
            svg:image.secure_url
        });
        res.status(201).json({
            success:true,
            message:"Software Application created successfully",
            softwareApplication
        })
    })

    static getAllSoftwareApplication=catchAsyncErrors(async(req,res,next)=>{
        const cacheDetails=await getCache("getAllSoftwareApplication");
        if(cacheDetails){
            return res.status(200).json({
                success:true,
                message:"Software Application fetched successfully",
                softwareApplication:cacheDetails
            })
        }
        const softwareApplication=await SoftwareApplication.find();
        await setCache("getAllSoftwareApplication",softwareApplication);
        res.status(200).json({
            success:true,
            message:"Software Application fetched successfully",
            softwareApplication
        })
        
       
    })
    static deleteSoftwareApplication=catchAsyncErrors(async(req,res,next)=>{
        const {id}=req.params;
        const softwareApplication=await SoftwareApplication.findById(id);
        if(!softwareApplication){
            return next(new ErrorHandler("Software Application not found",404));
        }
        await softwareApplication.deleteOne();
        res.status(200).json({
            success:true,
            message:"Software Application deleted successfully",
            softwareApplication
        })
    })



}