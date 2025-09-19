const cloudinary = require('../config/cloudinary')
const streamifier = require("streamifier");

function uploadToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
}

async function deleteFromCloudinary(imagesToDelete) {
    const deletions = imagesToDelete.map((url) => {
        const publicId = url.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`website_section_images/${publicId}`, { resource_type: "image" });
    });
    await Promise.all(deletions);
}


module.exports = { uploadToCloudinary, deleteFromCloudinary };
