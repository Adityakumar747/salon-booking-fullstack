const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../../../models/User');
const validate = require('../../../middleware/validate');
const { authLimiter } = require('../../../middleware/rateLimiter');
const { verifyJWT } = require('../../../middleware/auth');

const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/v1/auth/register
router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    const token = signToken(user._id);
    res.status(201).json({ token, user });
});

// POST /api/v1/auth/login
router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
        console.log(`Login failed: User not found - ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        console.log(`Login failed: Password mismatch - ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`Login success: ${email}`);
    const token = signToken(user._id);
    res.json({ token, user });
});

// GET /api/v1/auth/me
router.get('/me', verifyJWT, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
