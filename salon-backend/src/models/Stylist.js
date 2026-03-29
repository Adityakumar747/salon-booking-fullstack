const mongoose = require('mongoose');

const stylistSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        specialty: { type: String, required: true },
        bio: { type: String, default: '' },
        imageUrl: { type: String, default: '' },
        cloudinaryPublicId: { type: String, default: '' },
        isAvailable: { type: Boolean, default: true },
        experience: { type: Number, default: 1 }, // years
    },
    { timestamps: true }
);

module.exports = mongoose.model('Stylist', stylistSchema);
