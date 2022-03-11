const DatabaseHandler = require("./DatabaseHandler");
const UserSchema = require("./UserSchema");
const UserHandler = require("./UserHandler");

let conn;
let userModel;

beforeAll(async () => {
    conn = await DatabaseHandler.getDbConnection();
    userModel = conn.model('User', UserSchema);
});

test("Access production database -- pull users", async () => {
    const users = await UserHandler.getAllUsers();
    expect(users).toBeDefined();
});
