const router = require('express').Router();
const Appointment = require('../../../models/Appointment');
const { verifyJWT } = require('../../../middleware/auth');
const { requireAdmin } = require('../../../middleware/roles');

// GET /api/v1/admin/analytics
router.get('/', verifyJWT, requireAdmin, async (req, res) => {
    const { range, start, end } = req.query;
    const { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, format, startOfDay, endOfDay } = require('date-fns');

    // Build date range filter
    let dateFilter = {};
    const now = new Date();

    switch (range) {
        case 'today':
            dateFilter.date = format(now, 'yyyy-MM-dd');
            break;
        case 'week':
            dateFilter.date = {
                $gte: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
                $lte: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
            };
            break;
        case 'month':
            dateFilter.date = {
                $gte: format(startOfMonth(now), 'yyyy-MM-dd'),
                $lte: format(endOfMonth(now), 'yyyy-MM-dd'),
            };
            break;
        case 'previous':
            const prev = subMonths(now, 1);
            dateFilter.date = {
                $gte: format(startOfMonth(prev), 'yyyy-MM-dd'),
                $lte: format(endOfMonth(prev), 'yyyy-MM-dd'),
            };
            break;
        case 'custom':
            if (start && end) {
                dateFilter.date = { $gte: start, $lte: end };
            }
            break;
        default:
            // Fallback to current month if no range specified
            dateFilter.date = {
                $gte: format(startOfMonth(now), 'yyyy-MM-dd'),
                $lte: format(endOfMonth(now), 'yyyy-MM-dd'),
            };
    }

    // Exclude archived from analytics unless specifically requested (standard practice)
    dateFilter.status = { $ne: 'archived' };

    const [totalBookings, statusBreakdown, popularServices, recentBookings] = await Promise.all([
        // Total bookings count
        Appointment.countDocuments({ ...dateFilter }),

        // Status breakdown
        Appointment.aggregate([
            { $match: { ...dateFilter } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        // Most popular services (top 5)
        Appointment.aggregate([
            { $match: { ...dateFilter, status: { $nin: ['cancelled', 'archived'] } } },
            { $group: { _id: '$service', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'services',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'service',
                },
            },
            { $unwind: '$service' },
            { $project: { name: '$service.name', count: 1, category: '$service.category', price: '$service.price' } },
        ]),

        // Bookings over time
        Appointment.aggregate([
            { $match: { ...dateFilter, status: { $nin: ['cancelled', 'archived'] } } },
            { $group: { _id: '$date', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            { $limit: 90 }, // Increased limit for broader ranges
        ]),
    ]);

    // Revenue: sum of service prices for confirmed/completed appointments
    const revenueData = await Appointment.aggregate([
        { $match: { ...dateFilter, status: { $in: ['confirmed', 'completed'] } } },
        {
            $lookup: {
                from: 'services',
                localField: 'service',
                foreignField: '_id',
                as: 'serviceData',
            },
        },
        { $unwind: '$serviceData' },
        { $group: { _id: null, totalRevenue: { $sum: '$serviceData.price' } } },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({
        totalBookings,
        totalRevenue,
        statusBreakdown,
        popularServices,
        bookingsOverTime: recentBookings,
    });
});

module.exports = router;
