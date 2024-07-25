import {v2 as cloudinary} from cloudinary;


export const imageUploader = async (file, folder, height, quality, oldImagePublicId) => {
    try {
      const options = { folder };
      if (height && quality) {
        options.height = height;
        options.quality = quality;
      }
      options.resource_type = 'auto';
  
      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, options);
  
      // If the upload is successful, delete the old image
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
      }
  
      // Return the secure URL and public ID of the new image
      return {
        secure_url: result.secure_url,
        public_id: result.public_id
      };
  
    } catch (error) {
      console.error('Image update error:', error);
      return { error: 'Failed to update image', details: error };
    }
  };