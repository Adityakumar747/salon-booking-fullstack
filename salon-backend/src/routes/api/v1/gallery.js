const router = require('express').Router();
const GalleryImage = require('../../../models/GalleryImage');
const { verifyJWT } = require('../../../middleware/auth');
const { requireAdmin } = require('../../../middleware/roles');
const { galleryUpload, deleteFromCloudinary } = require('../../../utils/cloudinary');

// GET /api/v1/gallery - public
router.get('/', async (req, res) => {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const total = await GalleryImage.countDocuments(filter);
    const images = await GalleryImage.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    res.json({ images, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// POST /api/v1/gallery - admin: upload image
router.post('/', verifyJWT, requireAdmin, galleryUpload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    const { caption, category } = req.body;
    const image = await GalleryImage.create({
        cloudinaryUrl: req.file.path,
        publicId: req.file.filename,
        caption: caption || '',
        category: category || 'general',
        uploadedBy: req.user._id,
    });
    res.status(201).json({ image });
});

// DELETE /api/v1/gallery/:id - admin
router.delete('/:id', verifyJWT, requireAdmin, async (req, res) => {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    await deleteFromCloudinary(image.publicId);
    await image.deleteOne();
    res.json({ message: 'Image deleted' });
});

module.exports = router;
