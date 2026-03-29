const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
        stylist: { type: mongoose.Schema.Types.ObjectId, ref: 'Stylist', default: null },
        date: { type: String, required: true }, // YYYY-MM-DD
        timeSlot: { type: String, required: true }, // HH:MM (24h)
        endTime: { type: String, required: true }, // computed = timeSlot + duration
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled', 'archived'],
            default: 'pending',
        },
        notes: { type: String, default: '' },
    },
    { timestamps: true }
);

// Compound index to prevent double booking
appointmentSchema.index({ date: 1, timeSlot: 1, stylist: 1 }, { unique: false });

module.exports = mongoose.model('Appointment', appointmentSchema);
