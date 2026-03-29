const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const verifyAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@jawedhabib.com';
        const user = await User.findOne({ email: adminEmail });

        if (!user) {
            console.log('USER NOT FOUND: ' + adminEmail);
        } else {
            console.log('USER FOUND:');
            console.log('Name:', user.name);
            console.log('Email:', user.email);
            console.log('Role:', user.role);
            console.log('Password Hash Length:', user.password?.length);

            // Test password comparison locally
            const isMatch = await user.comparePassword('admin123');
            console.log('Password "admin123" matches:', isMatch);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error verifying admin:', error);
        process.exit(1);
    }
};

verifyAdmin();
