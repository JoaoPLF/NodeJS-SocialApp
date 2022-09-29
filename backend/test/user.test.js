require("dotenv").config();
const { assert } = require("chai");

const UserModel = require("../src/models/user.model");

const { createUser, loginUser, setUserDetails } = require("../src/controllers/user.controller");

const ValidationError = require("../src/utils/ValidationError");

const mockUser = require("./user.json");

const clearCollections = async () => {
  await UserModel.deleteMany({});
  return await UserModel.find();
};

describe("User", () => {
  it("should clear collections before tests", async () => {
    const users = await clearCollections();
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

    it("should set user details", async () => {
      try {
        const bio = "Abc";

        const user = await setUserDetails({
          handle: mockUser.handle,
          bio,
        });

        assert.equal(user.bio, bio);
        assert.equal(user.website, "");
        assert.equal(user.location, "");
      }
      catch (err) {
        throw err;
      }
    });
  });

  it("should clear collections after tests", async () => {
    const users = await clearCollections();
    assert.isEmpty(users);
  });
});