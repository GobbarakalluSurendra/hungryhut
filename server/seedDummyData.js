require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hungryhunt';

const categoriesData = [
    { name: 'Starters', description: 'Delicious appetizers to start your meal.', isActive: true },
    { name: 'Main Course', description: 'Hearty main dishes for everyone.', isActive: true },
    { name: 'Biryani', description: 'Authentic and aromatic biryani.', isActive: true },
    { name: 'Desserts', description: 'Sweet treats to end your meal.', isActive: true }
];

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database');

        // Clear existing data (optional, but good for fresh seeding)
        // await Category.deleteMany({});
        // await Product.deleteMany({});
        
        console.log('Seeding Categories...');
        const createdCategories = [];
        
        for (const catData of categoriesData) {
            // Use findOneAndUpdate with upsert to avoid duplicate key errors if run multiple times
            const cat = await Category.findOneAndUpdate(
                { name: catData.name },
                { $set: catData },
                { new: true, upsert: true }
            );
            createdCategories.push(cat);
        }

        console.log('Categories seeded successfully.');

        const productsData = [
            {
                name: 'Paneer Tikka',
                description: 'Spiced cottage cheese chunks grilled to perfection.',
                price: 250,
                category: createdCategories.find(c => c.name === 'Starters')._id,
                isVeg: true,
                isAvailable: true,
                imageUrl: 'http://localhost:5000/uploads/paneer.jpg?v=2'
            },
            {
                name: 'Chicken 65',
                description: 'Spicy, deep-fried chicken dish originating from Chennai.',
                price: 320,
                category: createdCategories.find(c => c.name === 'Starters')._id,
                isVeg: false,
                isAvailable: true,
                imageUrl: 'http://localhost:5000/uploads/chicken65.jpg?v=2'
            },
            {
                name: 'Butter Chicken',
                description: 'Tender chicken simmered in a rich tomato and butter gravy.',
                price: 380,
                category: createdCategories.find(c => c.name === 'Main Course')._id,
                isVeg: false,
                isAvailable: true,
                imageUrl: 'http://localhost:5000/uploads/butterchicken.jpg?v=2'
            },
            {
                name: 'Dal Makhani',
                description: 'Slow-cooked black lentils in butter and cream.',
                price: 280,
                category: createdCategories.find(c => c.name === 'Main Course')._id,
                isVeg: true,
                isAvailable: true,
                imageUrl: 'http://localhost:5000/uploads/dal.jpg?v=2'
            },
            {
                name: 'Hyderabadi Chicken Biryani',
                description: 'Aromatic basmati rice cooked with marinated chicken and spices.',
                price: 450,
                category: createdCategories.find(c => c.name === 'Biryani')._id,
                isVeg: false,
                isAvailable: true,
                imageUrl: 'http://localhost:5000/uploads/chickenbiryani.jpg?v=2'
            },
            {
                name: 'Veg Dum Biryani',
                description: 'Fragrant rice dish layered with mixed vegetables.',
                price: 350,
                category: createdCategories.find(c => c.name === 'Biryani')._id,
                isVeg: true,
                isAvailable: true,
                imageUrl: 'http://localhost:5000/uploads/vegbiryani.jpg?v=2'
            },
            {
                name: 'Gulab Jamun',
                description: 'Soft milk dumplings soaked in rose-flavored sugar syrup.',
                price: 120,
                category: createdCategories.find(c => c.name === 'Desserts')._id,
                isVeg: true,
                isAvailable: true,
                imageUrl: 'http://localhost:5000/uploads/gulab.jpg?v=2'
            }
        ];

        console.log('Seeding Products...');
        for (const prodData of productsData) {
             await Product.findOneAndUpdate(
                 { name: prodData.name },
                 { $set: prodData },
                 { upsert: true }
             );
        }

        console.log('Products seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
