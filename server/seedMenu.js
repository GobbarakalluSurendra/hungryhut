const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hungryhunt';

// Re-use schemas
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    image: String,
});
const Category = mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: String,
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
});
const Product = mongoose.model('Product', productSchema);

const menuData = [
    {
        categoryName: "Veg Biryani",
        items: [
            { name: "Kaju Biryani", price: 220, isVeg: true },
            { name: "Paneer Biryani", price: 220, isVeg: true },
            { name: "Mushroom Biryani", price: 200, isVeg: true },
        ]
    },
    {
        categoryName: "Fried Rice Items",
        items: [
            { name: "Ghee Fried Rice", price: 130, isVeg: true },
            { name: "Chicken Fried Rice", price: 130, isVeg: false },
            { name: "Paneer Fried Rice", price: 130, isVeg: true },
            { name: "Kaju Rice", price: 130, isVeg: true },
            { name: "Egg Rice", price: 110, isVeg: false },
            { name: "Jeera Rice", price: 110, isVeg: true },
            { name: "Tomato Rice", price: 110, isVeg: true },
            { name: "Veg Fried Rice", price: 110, isVeg: true },
            { name: "Mushroom Rice", price: 130, isVeg: true },
        ]
    },
    {
        categoryName: "Non-Veg Biryani",
        items: [
            { name: "Hungry Hut S.P Biryani", price: 240, isVeg: false },
            { name: "Mutton Dum Biryani", price: 250, isVeg: false },
            { name: "Mutton Roast Biryani", price: 250, isVeg: false },
            { name: "Chicken S.P Biryani", price: 220, isVeg: false },
            { name: "Lollipop Biryani", price: 220, isVeg: false },
            { name: "Chicken Dum Biryani", price: 150, isVeg: false },
            { name: "Chicken Roast Biryani", price: 150, isVeg: false },
        ]
    },
    {
        categoryName: "Veg Starters",
        items: [
            { name: "Paneer 65", price: 220, isVeg: true },
            { name: "Paneer Manchuriya", price: 220, isVeg: true },
            { name: "Chilli Paneer", price: 220, isVeg: true },
            { name: "Mushroom 65", price: 200, isVeg: true },
            { name: "Mushroom Chilli", price: 200, isVeg: true },
        ]
    },
    {
        categoryName: "Veg Curry Items",
        items: [
            { name: "Kaju Paneer Curry", price: 250, isVeg: true },
            { name: "Kaju Curry", price: 220, isVeg: true },
            { name: "Kadai Paneer", price: 220, isVeg: true },
            { name: "Paneer Butter Masala", price: 220, isVeg: true },
            { name: "Mushroom Curry", price: 200, isVeg: true },
            { name: "Mushroom Masala", price: 200, isVeg: true },
        ]
    },
    {
        categoryName: "Non-Veg Starters",
        items: [
            { name: "Hungry Hut Chicken", price: 220, isVeg: false },
            { name: "Dragon Chicken", price: 220, isVeg: false },
            { name: "Chicken Roast", price: 220, isVeg: false },
            { name: "Chicken 65", price: 220, isVeg: false },
            { name: "Chilli Chicken", price: 220, isVeg: false },
            { name: "Chicken Manchuriya", price: 220, isVeg: false },
            { name: "Lollipop Chicken", price: 220, isVeg: false },
            { name: "Egg Chilli", price: 150, isVeg: false },
            { name: "Egg Manchuriya", price: 150, isVeg: false },
            { name: "Egg 65", price: 150, isVeg: false },
        ]
    }
];

// Reusable Image Generator for Items
const generateImageForCategory = (name) => {
    const images = [
        'https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Biryani
        'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chicken
        'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Paneer/Curry
        'https://images.unsplash.com/photo-1623684225794-a8f1f50f4415?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Rice
    ];
    if (name.toLowerCase().includes('biryani')) return images[0];
    if (name.toLowerCase().includes('chicken') || name.toLowerCase().includes('egg') || name.toLowerCase().includes('mutton')) return images[1];
    if (name.toLowerCase().includes('rice')) return images[3];
    return images[2];
};

async function seedData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Optional: clear existing db first if needed. I will only add to it to avoid destroying existing items.
        // Or actually, it's better to clear existing dummy categories to avoid duplicates, but I will just add new ones.
        // If a category already exists, I will use it.
        
        for (const data of menuData) {
            let category = await Category.findOne({ name: data.categoryName });
            
            if (!category) {
                console.log(`Creating Category: ${data.categoryName}`);
                category = await Category.create({
                    name: data.categoryName,
                    description: `Delicious ${data.categoryName} from our menu`,
                    image: generateImageForCategory(data.categoryName)
                });
            }

            for (const item of data.items) {
                // Check if product exists
                const existingProduct = await Product.findOne({ name: item.name });
                if (!existingProduct) {
                    await Product.create({
                        name: item.name,
                        description: `Authentic ${item.name}`,
                        price: item.price,
                        category: category._id,
                        image: generateImageForCategory(item.name),
                        isVeg: item.isVeg,
                        isAvailable: true
                    });
                    console.log(`   Added Item: ${item.name}`);
                } else {
                    console.log(`   Item ${item.name} already exists. Skipping.`);
                }
            }
        }

        console.log('Seeding Completed Successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedData();
