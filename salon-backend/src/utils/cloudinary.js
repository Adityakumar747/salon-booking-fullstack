const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const galleryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'salon/gallery',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
    },
});

const serviceStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'salon/services',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, crop: 'limit', quality: 'auto' }],
    },
});

const stylistStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'salon/stylists',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 600, crop: 'fill', gravity: 'face', quality: 'auto' }],
    },
});

const galleryUpload = multer({ storage: galleryStorage });
const serviceUpload = multer({ storage: serviceStorage });
const stylistUpload = multer({ storage: stylistStorage });

const deleteFromCloudinary = async (publicId) => {
    if (publicId) await cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinary, galleryUpload, serviceUpload, stylistUpload, deleteFromCloudinary };
