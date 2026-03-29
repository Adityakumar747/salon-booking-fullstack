const router = require('express').Router();
const Appointment = require('../../../models/Appointment');
const SalonSettings = require('../../../models/SalonSettings');
const Service = require('../../../models/Service');
const { generateSlots, filterAvailableSlots } = require('../../../utils/slotEngine');

// GET /api/v1/slots?date=YYYY-MM-DD&serviceId=xxx
router.get('/', async (req, res) => {
    const { date, serviceId } = req.query;
    if (!date || !serviceId) {
        return res.status(400).json({ message: 'date and serviceId are required' });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: 'Invalid date format (use YYYY-MM-DD)' });
    }

    const settings = await SalonSettings.findOne().lean();
    const openTime = settings?.openTime || '09:00';
    const closeTime = settings?.closeTime || '20:00';
    const slotDuration = settings?.slotDuration || 30;
    const workingDays = settings?.workingDays || [1, 2, 3, 4, 5, 6];
    const holidays = settings?.holidays || [];

    // Check if date is a holiday
    if (holidays.includes(date)) {
        return res.json({ slots: [], reason: 'Holiday' });
    }

    // Check if date falls on a working day
    const dayOfWeek = new Date(date).getDay();
    if (!workingDays.includes(dayOfWeek)) {
        return res.json({ slots: [], reason: 'Salon closed on this day' });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const allSlots = generateSlots(openTime, closeTime, slotDuration, service.duration);

    const existingAppointments = await Appointment.find({
        date,
        status: { $ne: 'cancelled' },
    }).lean();

    const availableSlots = filterAvailableSlots(allSlots, existingAppointments, service.duration);

    // Filter out past slots if date is today
    const today = new Date().toISOString().slice(0, 10);
    let filteredSlots = availableSlots;
    if (date === today) {
        const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
        filteredSlots = availableSlots.filter((slot) => {
            const [h, m] = slot.split(':').map(Number);
            return h * 60 + m > nowMinutes + 30; // 30-min buffer
        });
    }

    res.json({ slots: filteredSlots, date, serviceId });
});

module.exports = router;
