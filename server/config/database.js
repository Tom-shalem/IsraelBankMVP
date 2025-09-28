const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

let db = null;

const connectDB = async () => {
  return new Promise((resolve, reject) => {
    try {
      // Create db.db file in the server directory
      const dbPath = path.join(__dirname, '..', 'db.db');
      console.log(`Initializing SQLite3 database at: ${dbPath}`);

      db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error(`SQLite3 connection error: ${err.message}`);
          reject(err);
          return;
        }

        console.log('SQLite3 Connected: Local database file');

        // Enable foreign key support
        db.run("PRAGMA foreign_keys = ON", (err) => {
          if (err) {
            console.error(`Error enabling foreign keys: ${err.message}`);
          }
        });

        resolve();
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        try {
          if (db) {
            db.close((err) => {
              if (err) {
                console.error('Error during SQLite3 shutdown:', err);
                process.exit(1);
              } else {
                console.log('SQLite3 connection closed through app termination');
                process.exit(0);
              }
            });
          } else {
            process.exit(0);
          }
        } catch (err) {
          console.error('Error during SQLite3 shutdown:', err);
          process.exit(1);
        }
      });

    } catch (error) {
      console.error(`Error: ${error.message}`);
      reject(error);
    }
  });
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

module.exports = {
  connectDB,
  getDB,
};