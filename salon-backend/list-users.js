const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({ role: 'admin' });
        console.log('--- ADMIN USERS ---');
        users.forEach(u => console.log(`${u.email} (${u.role})` || 'no user'));
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
};

listUsers();
