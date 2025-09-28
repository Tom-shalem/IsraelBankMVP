const { connectDB } = require('../config/database.js');
const User = require('./User.js');

const dbInit = async () => {
  try {
    console.log('Initializing SQLite3 database...');

    // Connect to SQLite3 database
    await connectDB();

    // Create all tables
    await User.createTable();

    console.log('Database initialization completed successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

module.exports = dbInit;
