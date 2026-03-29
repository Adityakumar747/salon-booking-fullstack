const mongoose = require('mongoose');

const salonSettingsSchema = new mongoose.Schema(
    {
        openTime: { type: String, default: '09:00' },   // HH:MM
        closeTime: { type: String, default: '20:00' },   // HH:MM
        slotDuration: { type: Number, default: 30 },      // minutes
        workingDays: {
            type: [Number],
            default: [1, 2, 3, 4, 5, 6],                  // 0=Sun,1=Mon,...,6=Sat
        },
        holidays: { type: [String], default: [] },        // ['YYYY-MM-DD']
        salonName: { type: String, default: 'Luxury Salon' },
        address: { type: String, default: '' },
        phone: { type: String, default: '' },
        email: { type: String, default: '' },
        googleMapsUrl: { type: String, default: '' },
        whatsappNumber: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('SalonSettings', salonSettingsSchema);
