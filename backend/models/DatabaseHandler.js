const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Initializing DB Connection
let dbConnection;

function setConnection(newConn) {
  dbConnection = newConn;
  return dbConnection;
}

function getDbConnection() {
  const database = process.env.MONGOLAB_URI;
  if (!dbConnection) {
    dbConnection = mongoose.connect(database, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  }
  return dbConnection;
}

module.exports = {
  setConnection,
  getDbConnection
};
