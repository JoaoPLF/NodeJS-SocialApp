const { assert, expect } = require("chai");
const { before, after } = require("mocha");

const { connectToDatabase, disconnectFromDatabase } = require("../src/config/database.config");
const { createUser } = require("../src/controllers/user.controller");
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
        createUser("test", "handle", "password");
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should create a new user", async () => {
      try {
        const newUser = await createUser("test@test.com", "a", "123");
        assert.isNotEmpty(newUser);
      }
      catch (err) {
        throw err;
      }
    });

    it("should fail to create an user that already exists", async () => {
      try {
        await createUser("test@test.com", "a", "123");
      }
      catch (err) {
        assert.instanceOf(err, Error);
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