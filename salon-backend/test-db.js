const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testConn = async () => {
    try {
        console.log('URI:', process.env.MONGODB_URI ? 'FOUND' : 'MISSING');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Connection Error:', error);
        process.exit(1);
    }
};

testConn();
