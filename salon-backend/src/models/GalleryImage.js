const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
    {
        cloudinaryUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        caption: { type: String, default: '' },
        category: {
            type: String,
            enum: ['hair', 'skin', 'bridal', 'grooming', 'general'],
            default: 'general',
        },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
