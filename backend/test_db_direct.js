const mongoose = require('mongoose');
// Direct connection to one shard to bypass SRV
const uri = "mongodb://pranaycablo_db_user:725272%40Raja@ac-x846rwc-shard-00-00.yyq7az5.mongodb.net:27017/cablo?ssl=true&authSource=admin&directConnection=true";

console.log("Attempting Direct Connection to Shard 0...");
mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas Shard!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  });
