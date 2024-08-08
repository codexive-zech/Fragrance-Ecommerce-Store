const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); // configuration setting for cloudinary to enable Media Upload

const cloudinaryUploadProductsImage = async (fileToUpload) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUpload, {
      use_filename: true,
      folder: "product-image",
      resource_type: "auto",
    });
    return { url: result.secure_url };
  } catch (error) {
    throw new Error("Failed to upload image");
  }
};

const cloudinaryUploadBlogsImage = async (fileToUpload) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUpload, {
      use_filename: true,
      folder: "blog-image",
      resource_type: "auto",
    });
    return { url: result.secure_url };
  } catch (error) {
    throw new Error("Failed to upload image");
  }
};

module.exports = { cloudinaryUploadProductsImage, cloudinaryUploadBlogsImage };
