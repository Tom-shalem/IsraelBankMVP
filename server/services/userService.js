const { randomUUID } = require('crypto');

const User = require('../models/User.js');
const { getDB } = require('../config/database.js');
const { generatePasswordHash, validatePassword } = require('../utils/password.js');

class UserService {
  static async list() {
    return new Promise((resolve, reject) => {
      try {
        const db = getDB();
        console.log('Listing all users');

        db.all('SELECT * FROM users ORDER BY createdAt DESC', (err, rows) => {
          if (err) {
            console.error(`Database error while listing users: ${err.message}`);
            reject(new Error(`Database error while listing users: ${err.message}`));
            return;
          }

          const users = rows.map(row => User.fromDB(row));
          resolve(users);
        });
      } catch (err) {
        console.error(`Error in UserService.list: ${err.message}`);
        reject(new Error(`Database error while listing users: ${err.message}`));
      }
    });
  }

  static async get(id) {
    return new Promise((resolve, reject) => {
      try {
        const db = getDB();
        console.log(`Getting user by ID: ${id}`);

        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
          if (err) {
            console.error(`Database error while getting user by ID: ${err.message}`);
            reject(new Error(`Database error while getting the user by their ID: ${err.message}`));
            return;
          }

          resolve(User.fromDB(row));
        });
      } catch (err) {
        console.error(`Error in UserService.get: ${err.message}`);
        reject(new Error(`Database error while getting the user by their ID: ${err.message}`));
      }
    });
  }

  static async getByEmail(email) {
    return new Promise((resolve, reject) => {
      try {
        const db = getDB();
        console.log(`Getting user by email: ${email}`);

        db.get('SELECT * FROM users WHERE email = ? COLLATE NOCASE', [email.toLowerCase()], (err, row) => {
          if (err) {
            console.error(`Database error while getting user by email: ${err.message}`);
            reject(new Error(`Database error while getting the user by their email: ${err.message}`));
            return;
          }

          resolve(User.fromDB(row));
        });
      } catch (err) {
        console.error(`Error in UserService.getByEmail: ${err.message}`);
        reject(new Error(`Database error while getting the user by their email: ${err.message}`));
      }
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      try {
        const db = getDB();
        console.log(`Updating user ${id} with data:`, Object.keys(data));

        // Build dynamic update query
        const fields = [];
        const values = [];

        Object.keys(data).forEach(key => {
          if (key !== 'id') {
            fields.push(`${key} = ?`);
            values.push(data[key]);
          }
        });

        if (fields.length === 0) {
          reject(new Error('No valid fields to update'));
          return;
        }

        values.push(id);
        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

        db.run(sql, values, function(err) {
          if (err) {
            console.error(`Database error while updating user: ${err.message}`);
            reject(new Error(`Database error while updating user ${id}: ${err.message}`));
            return;
          }

          // Return the updated user
          UserService.get(id).then(resolve).catch(reject);
        });
      } catch (err) {
        console.error(`Error in UserService.update: ${err.message}`);
        reject(new Error(`Database error while updating user ${id}: ${err.message}`));
      }
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      try {
        const db = getDB();
        console.log(`Deleting user ${id}`);

        db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
          if (err) {
            console.error(`Database error while deleting user: ${err.message}`);
            reject(new Error(`Database error while deleting user ${id}: ${err.message}`));
            return;
          }

          resolve(this.changes === 1);
        });
      } catch (err) {
        console.error(`Error in UserService.delete: ${err.message}`);
        reject(new Error(`Database error while deleting user ${id}: ${err.message}`));
      }
    });
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    try {
      console.log(`Authenticating user: ${email}`);
      const user = await UserService.getByEmail(email);
      if (!user) return null;

      const passwordValid = await validatePassword(password, user.password);
      if (!passwordValid) return null;

      // Update last login time
      const updatedUser = await UserService.update(user.id, {
        lastLoginAt: new Date().toISOString()
      });

      return updatedUser;
    } catch (err) {
      console.error(`Error in UserService.authenticateWithPassword: ${err.message}`);
      throw new Error(`Database error while authenticating user ${email} with password: ${err.message}`);
    }
  }

  static async create({ email, password, role = 'user' }) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) throw new Error('User with this email already exists');

    const hash = await generatePasswordHash(password);

    return new Promise((resolve, reject) => {
      try {
        const db = getDB();
        const refreshToken = randomUUID();
        console.log(`Creating new user: ${email}`);

        const userData = {
          email: email.toLowerCase(),
          password: hash,
          role: role,
          refreshToken: refreshToken,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isActive: 1
        };

        // Validate user data
        User.validateUserData(userData);

        db.run(
          'INSERT INTO users (email, password, role, refreshToken, createdAt, lastLoginAt, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [userData.email, userData.password, userData.role, userData.refreshToken, userData.createdAt, userData.lastLoginAt, userData.isActive],
          function(err) {
            if (err) {
              console.error(`Database error while creating user: ${err.message}`);
              if (err.message.includes('UNIQUE constraint failed')) {
                reject(new Error('User with this email already exists'));
              } else {
                reject(new Error(`Database error while creating new user: ${err.message}`));
              }
              return;
            }

            // Return the created user
            UserService.get(this.lastID).then(resolve).catch(reject);
          }
        );
      } catch (err) {
        console.error(`Error in UserService.create: ${err.message}`);
        reject(new Error(`Database error while creating new user: ${err.message}`));
      }
    });
  }

  static async setPassword(userId, password) {
    if (!password) throw new Error('Password is required');

    try {
      console.log(`Setting password for user ${userId}`);
      const hash = await generatePasswordHash(password);

      return await UserService.update(userId, { password: hash });
    } catch (err) {
      console.error(`Error in UserService.setPassword: ${err.message}`);
      throw new Error(`Database error while setting user password: ${err.message}`);
    }
  }
}

module.exports = UserService;
