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
  const databaseJest =
    "mongodb+srv://msultano:4152838823OrifSs@cluster0.az8az.mongodb.net/CSC308?retryWrites=true&w=majority";
  if (!dbConnection) {
    dbConnection = mongoose.connect(databaseJest, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  }
  return dbConnection;
}

module.exports = {
  setConnection,
  getDbConnection,
};
