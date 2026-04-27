require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const seedAdmin = async () => {
  try {
    // Correct Multi-Shard Connection String
    const uri = "mongodb://pranaycablo_db_user:725272%40Raja@ac-x846rwc-shard-00-00.yyq7az5.mongodb.net:27017,ac-x846rwc-shard-00-01.yyq7az5.mongodb.net:27017,ac-x846rwc-shard-00-02.yyq7az5.mongodb.net:27017/cablo?ssl=true&replicaSet=atlas-5bbslu-shard-0&authSource=admin&retryWrites=true&w=majority";
    
    await mongoose.connect(uri);
    console.log("✅ Database Connected for Seeding");

    const adminEmail = "pranay.cablo@cablo.ai";
    const adminPassword = "72527252@Raja";

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("ℹ️ Admin already exists");
      process.exit(0);
    }

    // Create Admin
    const admin = new User({
      name: "Pranay Admin",
      email: adminEmail,
      password: adminPassword,
      mobile: "+910000000000", // Required field
      role: "admin",
      status: "active",
      isKycVerified: true
    });

    await admin.save();
    console.log("🚀 Admin User Created Successfully!");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();
