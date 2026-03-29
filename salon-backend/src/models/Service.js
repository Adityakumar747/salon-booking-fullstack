const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ['hair', 'skin', 'bridal', 'grooming'],
            required: true,
        },
        audience: {
            type: String,
            enum: ['all', 'male', 'female', 'kids'],
            default: 'all',
        },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        duration: { type: Number, required: true, min: 15 }, // in minutes
        imageUrl: { type: String, default: '' },
        cloudinaryPublicId: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
