import  {Skill} from "../models/skillSchema.js"
import {catchAsyncErrors} from "../middleware/catchAsyncErrors.js"
import ErrorHandler  from "../middleware/error.js"
import {imageUploader} from "../utils/imageUploader.js"
import {getCache,setCache} from "../utils/Cache.js"

class SkillController{
    static createSkills=catchAsyncErrors(async(req,res,next)=>{
        const {title,proficiency}=req.body;
       const skillSvg = req.files.skillSvg;
       if(!title || !proficiency){
        return next(new ErrorHandler("please provide title and proficiency",400))
       }

       const image = await imageUploader(skillSvg,process.env.FOLDER_NAME)

        const skill=await Skill.create({
            title,
            proficiency,
            svg:image.secure_url
        })
        res.status(201).json({
            success:true,
            skill
        })

    })
    static getAllSkills=catchAsyncErrors(async(req,res,next)=>{
        const cacheData=await getCache("skills")
        if(cacheData){
            return res.status(200).json({
                success:true,
                skills:cacheData
            })
        }
        const skills=await Skill.find();
        await setCache("skills",skills)
        res.status(200).json({
            success:true,
            skills
        })
    })

    static deleteSkill=catchAsyncErrors(async(req,res,next)=>{
        const skill=await Skill.findById(req.params.id);
        if(!skill){
            return next(new ErrorHandler("skill not found",404))
        }
        await skill.deleteOne();
        res.status(200).json({
            success:true,
            message:"skill deleted successfully"
        })
    })

    static updateSkill=catchAsyncErrors(async(req,res,next)=>{

        const skill=await Skill.findById(req.params.id);
        if(!skill){
            return next(new ErrorHandler("skill not found",404))
        }
        const {title,proficiency}=req.body;
        const skillSvg = req.files.skillSvg;
        if(!title || !proficiency){
            return next(new ErrorHandler("please provide title and proficiency",400))
           }
        const image = await imageUploader(skillSvg,process.env.FOLDER_NAME)
        const updatedSkill=await Skill.findByIdAndUpdate(req.params.id,{
            title,
            proficiency,
            svg:image.secure_url
        },{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            success:true,
            skill:updatedSkill
        })

    })


}