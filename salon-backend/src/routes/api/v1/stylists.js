const router = require('express').Router();
const Stylist = require('../../../models/Stylist');
const { verifyJWT } = require('../../../middleware/auth');
const { requireAdmin } = require('../../../middleware/roles');
const { stylistUpload, deleteFromCloudinary } = require('../../../utils/cloudinary');

// GET /api/v1/stylists - public
router.get('/', async (req, res) => {
    const stylists = await Stylist.find({ isAvailable: true }).sort({ createdAt: 1 });
    res.json({ stylists });
});

// POST /api/v1/stylists - admin
router.post('/', verifyJWT, requireAdmin, stylistUpload.single('image'), async (req, res) => {
    const { name, specialty, bio, experience } = req.body;
    if (!name || !specialty) {
        return res.status(400).json({ message: 'name and specialty are required' });
    }
    const data = { name, specialty, bio, experience: Number(experience) || 1 };
    if (req.file) {
        data.imageUrl = req.file.path;
        data.cloudinaryPublicId = req.file.filename;
    }
    const stylist = await Stylist.create(data);
    res.status(201).json({ stylist });
});

// PUT /api/v1/stylists/:id - admin
router.put('/:id', verifyJWT, requireAdmin, stylistUpload.single('image'), async (req, res) => {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ message: 'Stylist not found' });
    const { name, specialty, bio, experience, isAvailable } = req.body;
    if (name) stylist.name = name;
    if (specialty) stylist.specialty = specialty;
    if (bio !== undefined) stylist.bio = bio;
    if (experience) stylist.experience = Number(experience);
    if (isAvailable !== undefined) stylist.isAvailable = isAvailable === 'true';
    if (req.file) {
        if (stylist.cloudinaryPublicId) await deleteFromCloudinary(stylist.cloudinaryPublicId);
        stylist.imageUrl = req.file.path;
        stylist.cloudinaryPublicId = req.file.filename;
    }
    await stylist.save();
    res.json({ stylist });
});

// DELETE /api/v1/stylists/:id - admin
router.delete('/:id', verifyJWT, requireAdmin, async (req, res) => {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ message: 'Stylist not found' });
    if (stylist.cloudinaryPublicId) await deleteFromCloudinary(stylist.cloudinaryPublicId);
    await stylist.deleteOne();
    res.json({ message: 'Stylist deleted' });
});

module.exports = router;
