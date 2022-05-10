const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Initializing DB Connection
let dbConnection;

function createDbConnection() {
  if (!dbConnection) {
    const uri = process.env.MONGOLAB_URI;
    const opts = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    };
    dbConnection = mongoose.connect(uri, opts);
  }
}

module.exports = {
  createDbConnection,
};
