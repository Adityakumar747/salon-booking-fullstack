const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const Service = require('./src/models/Service');
const SalonSettings = require('./src/models/SalonSettings');
const Stylist = require('./src/models/Stylist');
const GalleryImage = require('./src/models/GalleryImage');

const logFile = 'y:\\antigravity\\works\\salon-platform\\salon-backend\\seed_data_log.txt';
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

const services = [
    {
        name: 'Classic Haircut',
        category: 'hair',
        audience: 'all',
        description: 'Precision haircut by our expert stylists, includes consultation, shampoo, cut, and styling.',
        price: 499,
        duration: 45,
        imageUrl: '/assets/photos/hair-service.png',
    },
    {
        name: 'Hair Color & Highlights',
        category: 'hair',
        audience: 'all',
        description: 'Premium quality hair coloring with international brands. Includes consultation and post-color care treatment.',
        price: 2499,
        duration: 120,
        imageUrl: '/assets/photos/hair-color-service.png',
    },
    {
        name: 'Keratin Smoothening',
        category: 'hair',
        audience: 'all',
        description: 'Advanced keratin treatment for silky smooth, frizz-free hair that lasts up to 3 months.',
        price: 4999,
        duration: 180,
        imageUrl: '/assets/photos/hair-service.png',
    },
    {
        name: 'Hair Spa Treatment',
        category: 'hair',
        audience: 'all',
        description: 'Deep conditioning spa treatment to nourish and rejuvenate damaged hair. Includes scalp massage.',
        price: 1299,
        duration: 60,
        imageUrl: '/assets/photos/hair-service.png',
    },
    {
        name: 'Luxury Facial',
        category: 'skin',
        audience: 'all',
        description: 'Rejuvenating facial using premium products. Includes cleansing, exfoliation, mask, and hydration.',
        price: 1499,
        duration: 60,
        imageUrl: '/assets/photos/facial-service.png',
    },
    {
        name: 'Gold Facial',
        category: 'skin',
        audience: 'female',
        description: 'Premium 24-karat gold facial for anti-aging and radiant glow. Deep nourishment for your skin.',
        price: 2999,
        duration: 75,
        imageUrl: '/assets/photos/facial-service.png',
    },
    {
        name: 'De-Tan Treatment',
        category: 'skin',
        audience: 'all',
        description: 'Effective de-tan treatment to remove sun damage and restore natural skin tone.',
        price: 999,
        duration: 45,
        imageUrl: '/assets/photos/facial-service.png',
    },
    {
        name: 'Bridal Makeup Package',
        category: 'bridal',
        audience: 'female',
        description: 'Complete bridal transformation including HD makeup, hairstyling, draping, and touch-ups. Includes trial session.',
        price: 15999,
        duration: 240,
        imageUrl: '/assets/photos/bridal-service.png',
    },
    {
        name: 'Pre-Bridal Package',
        category: 'bridal',
        audience: 'female',
        description: '5-session pre-bridal preparation including facials, body polish, hair treatments, and skin care.',
        price: 9999,
        duration: 120,
        imageUrl: '/assets/photos/facial-service.png',
    },
    {
        name: 'Beard Grooming',
        category: 'grooming',
        audience: 'male',
        description: 'Professional beard shaping, trimming, and conditioning. Includes hot towel treatment.',
        price: 399,
        duration: 30,
        imageUrl: '/assets/photos/barber-service.png',
    },
    {
        name: 'Royal Shave',
        category: 'grooming',
        audience: 'male',
        description: 'Traditional hot towel shave with premium products for a smooth, refreshing finish.',
        price: 349,
        duration: 30,
        imageUrl: '/assets/photos/barber-service.png',
    },
    {
        name: 'Kids Haircut',
        category: 'hair',
        audience: 'kids',
        description: 'Fun and friendly haircut experience for children with gentle, expert handling.',
        price: 249,
        duration: 30,
        imageUrl: '/assets/photos/hair-kids-service.png',
    },
];

const stylists = [
    {
        name: 'Rahul Sharma',
        specialty: 'Hair Styling & Color',
        bio: 'Senior stylist with 8+ years of experience in precision cuts and creative coloring.',
        experience: 8,
        isAvailable: true,
    },
    {
        name: 'Priya Patel',
        specialty: 'Bridal & Skin Care',
        bio: 'Expert in bridal makeup and advanced skin treatments. Certified by Jawed Habib Academy.',
        experience: 6,
        isAvailable: true,
    },
    {
        name: 'Amit Kumar',
        specialty: 'Men\'s Grooming',
        bio: 'Specialist in men\'s grooming, beard styling, and classic barbering techniques.',
        experience: 5,
        isAvailable: true,
    },
];

const gallery = [
    { cloudinaryUrl: '/assets/photos/hair-service.png', publicId: 'local-hair', caption: 'Heritage Hair Artistry', category: 'hair' },
    { cloudinaryUrl: '/assets/photos/facial-service.png', publicId: 'local-facial', caption: 'Luxury Skin Rituals', category: 'skin' },
    { cloudinaryUrl: '/assets/photos/bridal-service.png', publicId: 'local-bridal', caption: 'Master Bridal Transformation', category: 'bridal' },
    { cloudinaryUrl: '/assets/photos/barber-service.png', publicId: 'local-barber', caption: 'Classic Grooming Excellence', category: 'grooming' },
    { cloudinaryUrl: '/assets/photos/hair-kids-service.png', publicId: 'local-kids', caption: 'Gentle Kids Styling', category: 'kids' },
    { cloudinaryUrl: '/assets/photos/hair-color-service.png', publicId: 'local-color', caption: 'Vibrant Hair Expressions', category: 'hair' },
];

const salonSettings = {
    openTime: '09:00',
    closeTime: '21:00',
    slotDuration: 30,
    workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    holidays: [],
    salonName: 'Jawed Habib',
    address: process.env.SALON_ADDRESS || 'Jawed Habib Heritage Wing',
    phone: '+91-9999999999',
    email: 'contact@jawedhabib.com',
    whatsappNumber: '919999999999',
};

async function seedData() {
    try {
        log('🚀 Starting data seed...');
        await mongoose.connect(process.env.MONGODB_URI);
        log('✅ Connected to MongoDB');

        // Seed Salon Settings
        await SalonSettings.deleteMany();
        await SalonSettings.create(salonSettings);
        log('✅ Salon settings re-synced');

        // Seed Services
        await Service.deleteMany();
        await Service.insertMany(services);
        log(`✅ ${services.length} services updated with unique images`);

        // Seed Stylists
        await Stylist.deleteMany();
        await Stylist.insertMany(stylists);
        log(`✅ ${stylists.length} stylists re-synced`);

        // Seed Gallery
        await GalleryImage.deleteMany();
        await GalleryImage.insertMany(gallery);
        log(`✅ ${gallery.length} gallery images seeded`);
        log('');
        log('🎉 Seed complete! Your salon platform is ready.');
        log('');
        log('Next steps:');
        log('  1. Start backend:  npm run dev  (in salon-backend)');
        log('  2. Start frontend: npm run dev  (in salon-frontend)');
        log('  3. Open http://localhost:3000');
        log('  4. Admin login: admin@jawedhabib.com / admin123');

        process.exit(0);
    } catch (error) {
        log('❌ ERROR: ' + error.message);
        if (error.message.includes('whitelist')) {
            log('');
            log('💡 Fix: Add your IP to MongoDB Atlas Network Access');
        }
        process.exit(1);
    }
}

seedData();
