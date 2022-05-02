const mongoose = require("mongoose");
const DatabaseHandler = require("./DatabaseHandler");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let conn;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = mongoose.createConnection(uri, mongooseOpts);
  DatabaseHandler.setConnection(conn);
});

afterAll(async () => {
  await conn.dropDatabase();
  await Promise.all(mongoose.connections.map(c => c.close()));
  await mongoServer.stop();
});

test("establish database connection", async () => {
  DatabaseHandler.setConnection(null);
  const db = await DatabaseHandler.getDbConnection();
  expect(db).toBeDefined();
});
