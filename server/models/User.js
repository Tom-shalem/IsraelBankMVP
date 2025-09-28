const { getDB } = require('../config/database.js');
const { validatePassword, isPasswordHash } = require('../utils/password.js');
const { randomUUID } = require("crypto");
const { ROLES } = require('../../shared/config/roles.js');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.password = userData.password;
    this.createdAt = userData.createdAt;
    this.lastLoginAt = userData.lastLoginAt;
    this.isActive = userData.isActive;
    this.role = userData.role;
    this.refreshToken = userData.refreshToken;
  }

  // Create the users table
  static async createTable() {
    return new Promise((resolve, reject) => {
      const db = getDB();
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          lastLoginAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          isActive INTEGER DEFAULT 1,
          role TEXT DEFAULT '${ROLES.USER}' CHECK (role IN ('${ROLES.ADMIN}', '${ROLES.USER}')),
          refreshToken TEXT UNIQUE
        )
      `;

      db.run(createTableSQL, (err) => {
        if (err) {
          console.error(`Error creating users table: ${err.message}`);
          reject(err);
        } else {
          console.log('Users table created or already exists');

          // Create index on email for faster lookups
          db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)', (indexErr) => {
            if (indexErr) {
              console.error(`Error creating email index: ${indexErr.message}`);
            }
          });

          // Create index on refreshToken for faster lookups
          db.run('CREATE INDEX IF NOT EXISTS idx_users_refresh_token ON users(refreshToken)', (tokenIndexErr) => {
            if (tokenIndexErr) {
              console.error(`Error creating refresh token index: ${tokenIndexErr.message}`);
            }
          });

          resolve();
        }
      });
    });
  }

  // Convert database row to User object, excluding password from JSON
  static fromDB(row) {
    if (!row) return null;
    const user = new User({
      id: row.id,
      email: row.email.toLowerCase(),
      password: row.password,
      createdAt: row.createdAt,
      lastLoginAt: row.lastLoginAt,
      isActive: Boolean(row.isActive),
      role: row.role,
      refreshToken: row.refreshToken
    });
    return user;
  }

  // Convert user to JSON, excluding password
  toJSON() {
    const obj = { ...this };
    delete obj.password;
    return obj;
  }

  // Validate user data before insertion/update
  static validateUserData(userData) {
    if (!userData.email) {
      throw new Error('Email is required');
    }
    if (!userData.password) {
      throw new Error('Password is required');
    }
    if (userData.password && !isPasswordHash(userData.password)) {
      throw new Error('Invalid password hash');
    }
    if (userData.role && ![ROLES.ADMIN, ROLES.USER].includes(userData.role)) {
      throw new Error('Invalid role');
    }
  }
}

module.exports = User;
