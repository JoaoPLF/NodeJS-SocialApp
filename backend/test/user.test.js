require("dotenv").config();
const { assert } = require("chai");
const { before, after } = require("mocha");

const { connectToDatabase, disconnectFromDatabase } = require("../src/config/database.config");
const { createUser, loginUser } = require("../src/controllers/user.controller");
const UserModel = require("../src/models/user.model");
const ValidationError = require("../src/utils/ValidationError");

before(async () => {
  try {
    await connectToDatabase();
    await UserModel.deleteMany({});
  }
  catch (err) {
    console.log(err);
  }
});

describe("User", () => {
  it("Collection should be empty", async () => {
    const users = await UserModel.find();
    assert.isEmpty(users);
  });

  describe("Create User", () => {
    it("should throw ValidationError", async () => {
      try {
        await createUser("test", "handle", "password", "password");
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should throw Error for missing fields", async () => {
      try {
        await createUser("test@test.com", "", "", "");
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should fail because password does not match confirmation", async () => {
      try {
        await createUser("test@test.com", "a", "123", "1");
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should create a new user", async () => {
      try {
        const user = await createUser("test@test.com", "a", "123", "123");
        assert.isNotEmpty(user);
        assert.containsAllKeys(user, "token");
      }
      catch (err) {
        throw err;
      }
    });

    it("should fail to create an user that already exists", async () => {
      try {
        await createUser("test@test.com", "a", "123", "123");
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should login the user", async () => {
      try {
        const user = await loginUser("test@test.com", "123");
        assert.isNotEmpty(user);
        assert.containsAllKeys(user, "token");
      }
      catch (err) {
        throw err;
      }
    });
  });
});

after(async () => {
  try {
    await UserModel.deleteMany({});
    await disconnectFromDatabase();
  }
  catch (err) {
    console.log(err);
  }
});