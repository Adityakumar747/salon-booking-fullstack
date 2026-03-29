const router = require('express').Router();
const { z } = require('zod');
const Service = require('../../../models/Service');
const { verifyJWT } = require('../../../middleware/auth');
const { requireAdmin } = require('../../../middleware/roles');
const validate = require('../../../middleware/validate');
const { serviceUpload, deleteFromCloudinary } = require('../../../utils/cloudinary');

const serviceSchema = z.object({
    name: z.string().min(2),
    category: z.enum(['hair', 'skin', 'bridal', 'grooming']),
    audience: z.enum(['all', 'male', 'female', 'kids']).optional().default('all'),
    description: z.string().min(10),
    price: z.coerce.number().min(0),
    duration: z.coerce.number().min(15),
});

// Helper: wrap multer upload so its errors propagate to the global errorHandler
function uploadMiddleware(req, res, next) {
    serviceUpload.single('image')(req, res, (err) => {
        if (err) {
            err.statusCode = 422;
            err.message = `Image upload failed: ${err.message}`;
            return next(err);
        }
        next();
    });
}

// GET /api/v1/services - public
router.get('/', async (req, res) => {
    const { category, audience } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (audience && audience !== 'all') {
        // Return services matching the audience OR services tagged 'all'
        filter.audience = { $in: [audience, 'all'] };
    }
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json({ services });
});

// GET /api/v1/services/:id - public
router.get('/:id', async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ service });
});

// POST /api/v1/services - admin only (with optional image)
router.post('/', verifyJWT, requireAdmin, uploadMiddleware, async (req, res) => {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        });
    }
    const data = parsed.data;
    if (req.file) {
        data.imageUrl = req.file.path;
        data.cloudinaryPublicId = req.file.filename;
    }
    const service = await Service.create(data);
    res.status(201).json({ service });
});

// PUT /api/v1/services/:id - admin only
router.put('/:id', verifyJWT, requireAdmin, uploadMiddleware, async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const parsed = serviceSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        });
    }
    const data = parsed.data;

    if (req.file) {
        if (service.cloudinaryPublicId) await deleteFromCloudinary(service.cloudinaryPublicId);
        data.imageUrl = req.file.path;
        data.cloudinaryPublicId = req.file.filename;
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ service: updated });
});

// DELETE /api/v1/services/:id - admin only
router.delete('/:id', verifyJWT, requireAdmin, async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.cloudinaryPublicId) await deleteFromCloudinary(service.cloudinaryPublicId);
    await service.deleteOne();
    res.json({ message: 'Service deleted' });
});

module.exports = router;
