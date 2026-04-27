const mongoose = require('mongoose');
const uri = "mongodb://pranaycablo_db_user:725272%40Raja@ac-x846rwc-shard-00-00.yyq7az5.mongodb.net:27017/cablo?ssl=true&authSource=admin&directConnection=true";

mongoose.connect(uri)
  .then(async () => {
    const admin = mongoose.connection.db.admin();
    const info = await admin.command({ isMaster: 1 });
    console.log("REPLICA_SET_NAME:", info.setName);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
