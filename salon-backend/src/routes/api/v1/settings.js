const router = require('express').Router();
const SalonSettings = require('../../../models/SalonSettings');
const { verifyJWT } = require('../../../middleware/auth');
const { requireAdmin } = require('../../../middleware/roles');

// GET /api/v1/settings - public
router.get('/', async (req, res) => {
    let settings = await SalonSettings.findOne();
    if (!settings) {
        settings = await SalonSettings.create({});
    }
    res.json({ settings });
});

// PUT /api/v1/settings - admin only
router.put('/', verifyJWT, requireAdmin, async (req, res) => {
    const allowedFields = [
        'openTime', 'closeTime', 'slotDuration', 'workingDays',
        'holidays', 'salonName', 'address', 'phone', 'email',
        'googleMapsUrl', 'whatsappNumber',
    ];
    const updates = {};
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    let settings = await SalonSettings.findOne();
    if (!settings) {
        settings = await SalonSettings.create(updates);
    } else {
        Object.assign(settings, updates);
        await settings.save();
    }
    res.json({ settings });
});

module.exports = router;
