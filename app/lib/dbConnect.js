import mongoose from 'mongoose';

// Import all models to ensure they're properly registered before use
import '../models/index';

let isConnected = false;

const dbConnect = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    if (mongoose.connection.readyState >= 1) {
        isConnected = true;
        console.log('Using existing database connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('New database connection established');
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default dbConnect;

