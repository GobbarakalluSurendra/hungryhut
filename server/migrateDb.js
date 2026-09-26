const mongoose = require('mongoose');

const localUri = 'mongodb://localhost:27017/hungryhunt';
const remoteUri = 'mongodb+srv://sgobbarakallu_db_user:fJZK9gpBdwMm2jTZ@cluster0.o8tzmwr.mongodb.net/hungryhunt?appName=Cluster0';

async function migrate() {
    try {
        console.log('Connecting to local DB...');
        const localDb = await mongoose.createConnection(localUri).asPromise();
        console.log('Connected local.');

        console.log('Connecting to remote DB...');
        const remoteDb = await mongoose.createConnection(remoteUri).asPromise();
        console.log('Connected remote.');

        // Get all collections from local DB
        const collections = await localDb.db.listCollections().toArray();
        
        for (let col of collections) {
            const collectionName = col.name;
            console.log(`Migrating collection: ${collectionName}...`);
            
            // Fetch all docs from local
            const localCollection = localDb.collection(collectionName);
            const docs = await localCollection.find({}).toArray();
            
            if (docs.length > 0) {
                // Insert into remote
                const remoteCollection = remoteDb.collection(collectionName);
                // Clear existing remote data for this collection to avoid duplicate key errors
                await remoteCollection.deleteMany({});
                await remoteCollection.insertMany(docs);
                console.log(`Inserted ${docs.length} documents into remote ${collectionName}.`);
            } else {
                console.log(`Collection ${collectionName} is empty. Skipping.`);
            }
        }
        
        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
