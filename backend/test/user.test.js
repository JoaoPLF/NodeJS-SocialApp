require("dotenv").config();
const { assert } = require("chai");
const { before, after } = require("mocha");

const { connectToDatabase, disconnectFromDatabase } = require("../src/config/database.config");
const { createUser, loginUser } = require("../src/controllers/user.controller");
const UserModel = require("../src/models/user.model");
const ValidationError = require("../src/utils/ValidationError");

const mockUser = require("./user.json");

// before(async () => {
//   try {
//     await connectToDatabase();
//     await UserModel.deleteMany({});
//   }
//   catch (err) {
//     console.log(err);
//   }
// });

describe("User", () => {
  it("Collection Users should be empty", async () => {
    const users = await UserModel.find();
    assert.isEmpty(users);
  });

  describe("Create User", () => {
    it("should throw ValidationError for invalid email", async () => {
      try {
        await createUser({ email: "test", handle: "handle", password: "password", confirmPassword: "password"});
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should throw ValidationError for missing fields", async () => {
      try {
        await createUser({ email: "test@test.com", handle: "", password: "", confirmPassword: ""});
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should throw ValidationError because password does not match confirmation", async () => {
      try {
        await createUser({ email: "test@test.com", handle: "a", password: "123", confirmPassword: "1"});
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should create a new user", async () => {
      try {
        const user = await createUser({ ...mockUser });
        assert.isNotEmpty(user);
        assert.containsAllKeys(user, "token");
      }
      catch (err) {
        throw err;
      }
    });

    it("should throw ValidationError when creating an user that already exists", async () => {
      try {
        await createUser({ ...mockUser });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should login the user", async () => {
      try {
        const token = await loginUser({ email: mockUser.email, password: mockUser.password });
        assert.isNotEmpty(token);
        assert.containsAllKeys(token, "token");
      }
      catch (err) {
        throw err;
      }
    });
  });
});

// after(async () => {
//   try {
//     await UserModel.deleteMany({});
//     await disconnectFromDatabase();
//   }
//   catch (err) {
//     console.log(err);
//   }
// });