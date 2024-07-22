import { Project } from "../models/projectSchema.js"
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js"
import ErrorHandler from "../middleware/error.js"
import { imageUploader } from "../utils/imageUploader.js"
import { getCache, setCache } from "../utils/Cache.js"





class ProjectController {
    static createProject = catchAsyncErrors(async (req, res, next) => {
        const { title, description, gitRepo, projectLink, technologies } = req.body;
        const projectImage = req.files.projectImage;
        if (!title || !description || !gitRepo || !projectLink || !technologies) {
            return next(new ErrorHandler("please provide title,description and url", 400))
        }
        const image = await imageUploader(projectImage, process.env.FOLDER_NAME)
        const project = await Project.create({
            title,
            description,
            gitRepo,
            projectLink,
            technologies,
            ProjectBanner: image.secure_url
        })
        res.status(201).json({
            success: true,
            project
        })


    })
    static getAllProjects = catchAsyncErrors(async (req, res, next) => {
        const cacheData = await getCache("projects")
        if (cacheData) {
            return res.status(200).json({
                success: true,
                projects: cacheData
            })
        }
        const projects = await Project.find({});
        await setCache("projects", projects)
        res.status(200).json({
            success: true,
            projects
        })
    })
    static deleteProject = catchAsyncErrors(async (req, res, next) => {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return next(new ErrorHandler("project not found", 404))
        }
        await project.deleteOne();
        res.status(200).json({
            success: true,
            message: "project deleted successfully"
        })
    })

    static updateProject = catchAsyncErrors(async (req, res, next) => {

        const { title, description, gitRepo, projectLink, technologies } = req.body;
        const projectImage = req.files.projectImage;
        if (!title || !description || !gitRepo || !projectLink || !technologies) {
            return next(new ErrorHandler("please provide title,description and url", 400))
        }
        const image = await imageUploader(projectImage, process.env.FOLDER_NAME)
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, {
            title,
            description,
            gitRepo,
            projectLink,
            technologies,
            ProjectBanner: image.secure_url
        }, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            success:"Projects updated successfully",
            updatedProject
        })


    })
    static getProjectById = catchAsyncErrors(async (req, res, next) => {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return next(new ErrorHandler("project not found", 404))
        }
        res.status(200).json({
            success: true,
            project
        })
    })
}