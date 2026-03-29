const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('./src/models/User');

dotenv.config();

// Use absolute path for log file in the workspace
const logFile = 'y:\\antigravity\\works\\salon-platform\\salon-backend\\seed_log.txt';
const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
};

if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

const seedAdmin = async () => {
    try {
        log('Starting seed process...');
        await mongoose.connect(process.env.MONGODB_URI);
        log('Connected to MongoDB...');

        const adminEmail = 'admin@jawedhabib.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            log('Admin user already exists.');
            process.exit(0);
        }

        log('Creating new admin user...');
        const adminUser = new User({
            name: 'Jawed Habib Admin',
            email: adminEmail,
            password: 'admin123',
            role: 'admin',
            phone: '9999999999'
        });

        await adminUser.save();
        log('Admin user created successfully!');
        log('Email: admin@jawedhabib.com');
        log('Password: admin123');

        process.exit(0);
    } catch (error) {
        log('ERROR OCCURRED:');
        log(error.name || 'Unknown Error');
        log(error.message || 'No message');
        if (error.errors) {
            log('VALIDATION ERRORS:');
            Object.keys(error.errors).forEach(key => {
                log(`${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seedAdmin();
