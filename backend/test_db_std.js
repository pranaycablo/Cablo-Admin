const mongoose = require('mongoose');
// Standard connection string format (Non-SRV)
const uri = "mongodb://pranaycablo_db_user:725272%40Raja@ac-x846rwc-shard-00-00.yyq7az5.mongodb.net:27017,ac-x846rwc-shard-00-01.yyq7az5.mongodb.net:27017,ac-x846rwc-shard-00-02.yyq7az5.mongodb.net:27017/?ssl=true&replicaSet=atlas-2f0j6j-shard-0&authSource=admin&retryWrites=true&w=majority";

console.log("Attempting to connect via Standard Connection String...");
mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  });
