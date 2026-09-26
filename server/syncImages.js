const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hungryhunt';

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

const sourceDir = path.join(__dirname, '../client/images');
const targetDir = path.join(__dirname, '../client/public/menu-images');

async function syncImages() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        if (!fs.existsSync(targetDir)){
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const files = fs.readdirSync(sourceDir);
        console.log('Found images:', files);

        // create a normalized map for easy lookup
        const imageMap = {};
        for (const file of files) {
            const ext = path.extname(file);
            const nameWithoutExt = path.basename(file, ext).toLowerCase().trim().replace(/,/g, '');
            imageMap[nameWithoutExt] = file;
        }
        console.log('Image Map:', imageMap);

        const products = await Product.find({});
        console.log(`Found ${products.length} products in DB.`);

        let keptCount = 0;
        let deletedCount = 0;

        for (const product of products) {
            const prodName = product.name.toLowerCase().trim();
            
            // Try to find exact or partial match
            let matchedFile = null;
            
            if (imageMap[prodName]) {
                matchedFile = imageMap[prodName];
            } else {
                // Try loose matching
                for (const [key, val] of Object.entries(imageMap)) {
                    if (prodName.includes(key) || key.includes(prodName)) {
                        matchedFile = val;
                        break;
                    }
                }
            }

            if (matchedFile) {
                // Match found
                console.log(`Keeping: ${product.name} (Matched with ${matchedFile})`);
                
                // Copy to public directory
                const sourcePath = path.join(sourceDir, matchedFile);
                const targetPath = path.join(targetDir, matchedFile);
                if (!fs.existsSync(targetPath)) {
                    fs.copyFileSync(sourcePath, targetPath);
                }
                
                // Update product image path
                product.image = `/menu-images/${encodeURIComponent(matchedFile)}`;
                await product.save();
                keptCount++;
            } else {
                // No match, delete product
                console.log(`Deleting: ${product.name} (No image found)`);
                await Product.findByIdAndDelete(product._id);
                deletedCount++;
            }
        }

        console.log(`Summary: Kept ${keptCount} items. Deleted ${deletedCount} items.`);
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

syncImages();
