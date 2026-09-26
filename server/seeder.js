require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hungryhunt';

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        
        const existingAdmin = await User.findOne({ email: 'admin@hungryhunt.com' });
        
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        await User.create({
            name: 'Admin',
            email: 'admin@hungryhunt.com',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'ADMIN'
        });

        console.log('Admin user seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
