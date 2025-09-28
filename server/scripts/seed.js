const path = require('path');
const { randomUUID } = require('crypto');

// Add parent directory to path so we can import from server
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbInit = require('../models/init.js');
const UserService = require('../services/userService.js');
const { generatePasswordHash } = require('../utils/password.js');
const { ROLES } = require('../../shared/config/roles.js');

const seedUsers = [
  {
    email: 'client@client.com',
    password: 'Client2025$',
    role: ROLES.USER,
  },
  {
    email: 'amit@client.com',
    password: 'Client2025$',
    role: ROLES.USER,
  },
  {
    email: 'admin@bank.com',
    password: 'Admin2025$',
    role: ROLES.ADMIN,
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize database and create tables
    await dbInit();
    console.log('✅ Database initialized successfully');

    // Check if users already exist
    const existingUsers = await UserService.list();
    if (existingUsers.length > 0) {
      console.log('📊 Database already contains users. Skipping seeding.');
      console.log(`   Found ${existingUsers.length} existing users:`);
      existingUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
      return;
    }

    console.log('👥 Seeding demo users...');

    // Create demo users
    for (const userData of seedUsers) {
      try {
        console.log(`   Creating user: ${userData.email}`);
        const user = await UserService.create(userData);
        console.log(`   ✅ Created user: ${user.email} (ID: ${user.id})`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`   ℹ️  User ${userData.email} already exists, skipping`);
        } else {
          console.error(`   ❌ Failed to create user ${userData.email}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Accounts for Testing:');
    console.log('   • client@client.com (password: Client2025$) - Regular user');
    console.log('   • amit@client.com (password: Client2025$) - Regular user');
    console.log('   • admin@bank.com (password: Admin2025$) - Admin user');
    console.log('\n💡 You can now use these accounts to test the banking application.');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('\n🏁 Seeding process completed. Exiting...');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Fatal error during seeding:', error);
    process.exit(1);
  });
}

module.exports = seedDatabase;