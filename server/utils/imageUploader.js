import {cloudinary} from cloudinary;
import logger from "../config/logger.js";


export const imageUploader=async(file,folder,height,quality)=>{
    try {
        const options={folder};
        if(height && quality){
            options.height=height;
            options.quality=quality;
        }
        options.resource_type="auto";
        return await cloudinary.uploader.upload(file.tempFilePath,options);
        
    } catch (error) {
       logger.error(error);
        return error;
    }
}