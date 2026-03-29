const router = require('express').Router();
const { z } = require('zod');
const Appointment = require('../../../models/Appointment');
const Service = require('../../../models/Service');
const SalonSettings = require('../../../models/SalonSettings');
const { verifyJWT } = require('../../../middleware/auth');
const { requireAdmin } = require('../../../middleware/roles');
const validate = require('../../../middleware/validate');
const { addMinutes, format } = require('date-fns');

const appointmentSchema = z.object({
    serviceId: z.string().min(1),
    stylistId: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timeSlot: z.string().regex(/^\d{2}:\d{2}$/),
    notes: z.string().optional(),
});

// Compute endTime from timeSlot + duration
async function computeEndTime(timeSlot, serviceId) {
    const service = await Service.findById(serviceId);
    if (!service) throw Object.assign(new Error('Service not found'), { statusCode: 404 });
    const [h, m] = timeSlot.split(':').map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    const end = addMinutes(base, service.duration);
    return format(end, 'HH:mm');
}

// POST /api/v1/appointments - Create booking
router.post('/', verifyJWT, validate(appointmentSchema), async (req, res) => {
    const { serviceId, stylistId, date, timeSlot, notes } = req.body;

    const endTime = await computeEndTime(timeSlot, serviceId);

    // Check for conflicting appointment (same stylist/user, date, overlapping time)
    // Overlap logic: (startA < endB) AND (endA > startB)
    const conflict = await Appointment.findOne({
        date,
        status: { $ne: 'cancelled' },
        ...(stylistId ? { stylist: stylistId } : {}),
        timeSlot: { $lt: endTime },
        endTime: { $gt: timeSlot }
    });
    if (conflict) return res.status(409).json({ message: 'Requested time slot overlaps with another booking' });

    const appointment = await Appointment.create({
        user: req.user._id,
        service: serviceId,
        stylist: stylistId || null,
        date,
        timeSlot,
        endTime,
        notes,
    });

    await appointment.populate(['service', 'stylist']);
    res.status(201).json({ appointment });
});

// GET /api/v1/appointments/my - User's own appointments
router.get('/my', verifyJWT, async (req, res) => {
    const appointments = await Appointment.find({ user: req.user._id })
        .populate('service', 'name price duration category imageUrl')
        .populate('stylist', 'name specialty imageUrl')
        .sort({ date: -1, timeSlot: -1 });
    res.json({ appointments });
});

// GET /api/v1/appointments - Admin: all appointments with pagination
router.get('/', verifyJWT, requireAdmin, async (req, res) => {
    const { page = 1, limit = 20, status, date, includeArchived = 'false' } = req.query;
    const filter = {};

    if (status) {
        filter.status = status;
    } else if (includeArchived === 'false') {
        // Hide archived by default if no status filter
        filter.status = { $ne: 'archived' };
    }

    if (date) filter.date = date;

    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
        .populate('user', 'name email phone')
        .populate('service', 'name price duration category')
        .populate('stylist', 'name specialty')
        .sort({ date: -1, timeSlot: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({ appointments, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// PATCH /api/v1/appointments/:id/status - Admin update status
router.patch('/:id/status', verifyJWT, requireAdmin, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'archived'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    ).populate(['user', 'service', 'stylist']);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ appointment });
});

// PATCH /api/v1/appointments/:id/cancel - User cancel own appointment
router.patch('/:id/cancel', verifyJWT, async (req, res) => {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.status === 'cancelled') {
        return res.status(400).json({ message: 'Already cancelled' });
    }
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ appointment });
});

// PATCH /api/v1/appointments/:id/reschedule - User reschedule
router.patch('/:id/reschedule', verifyJWT, async (req, res) => {
    const { date, timeSlot } = req.body;
    if (!date || !timeSlot) return res.status(400).json({ message: 'Date and timeSlot required' });

    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const conflict = await Appointment.findOne({
        date,
        timeSlot,
        status: { $ne: 'cancelled' },
        _id: { $ne: appointment._id },
        ...(appointment.stylist ? { stylist: appointment.stylist } : {}),
    });
    if (conflict) return res.status(409).json({ message: 'Requested slot is not available' });

    const endTime = await computeEndTime(timeSlot, appointment.service);
    appointment.date = date;
    appointment.timeSlot = timeSlot;
    appointment.endTime = endTime;
    appointment.status = 'pending';
    await appointment.save();
    res.json({ appointment });
});

module.exports = router;
