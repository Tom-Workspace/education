import mongoose from 'mongoose';
import dbConnect from './dbConnect';

/**
 * This script drops the unique index on username field in the users collection
 * This is a one-time fix for the duplicate key error issue
 */
async function dropUsernameIndex() {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // List all indexes on the collection
    const indexes = await usersCollection.indexes();
    
    // Find if there's a username index and drop it
    const usernameIndex = indexes.find(index => 
      index.key && index.key.username !== undefined
    );
    
    if (usernameIndex) {
      console.log('Found username index, dropping it...');
      await usersCollection.dropIndex('username_1');
      console.log('Username index dropped successfully!');
    } else {
      console.log('No username index found.');
    }
  } catch (error) {
    console.error('Error dropping index:', error);
  } finally {
    // Don't disconnect if other parts of the app might be using the connection
  }
}

export default dropUsernameIndex;
