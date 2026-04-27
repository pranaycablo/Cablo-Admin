const mongoose = require('mongoose');
const uri = "mongodb+srv://pranaycablo_db_user:725272%40Raja@cluster0.yyq7az5.mongodb.net/?appName=Cluster0";

console.log("Attempting to connect to MongoDB Atlas...");
mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  });
