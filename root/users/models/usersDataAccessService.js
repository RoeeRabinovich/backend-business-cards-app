const User = require("../models/mongodb/User");
const config = require("config");
const _ = require("lodash");
const { handleBadRequest } = require("../../utils/errorHandler");
const { comparePassword } = require("../helpers/bcrypt");
const { generateAuthToken } = require("../../auth/Providers/jwt");

// Database selection
const DB = config.get("DB");

// Data Access Functions
/// Create new user
exports.createUser = async (normalizedUser) => {
  if (DB === "MONGODB") {
    try {
      const { email } = normalizedUser;
      let user = await User.findOne({ email });
      if (user) throw new Error("User already registered.");

      user = new User(normalizedUser);
      user = await user.save();

      user = _.pick(user, ["name", "email", "_id"]);
      return Promise.resolve(user);
    } catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }
  return Promise.resolve("registerUser not in mongodb.");
};

// Login user
exports.login = async ({ email, password }) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Authentication Error: Invalid email.");

      const validPassword = comparePassword(password, user.password);
      if (!validPassword)
        throw new Error("Authentication Error: Invalid password.");

      const token = generateAuthToken(user);
      return Promise.resolve(token);
    } catch (error) {
      error.status = error.status || 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("loginUser user not in mongodb");
};

// Get all users
exports.findUsers = async () => {
  if (DB === "MONGODB") {
    try {
      const users = await User.find({}, { password: 0, __v: 0 });
      return Promise.resolve(users);
    } catch (error) {
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("Get users not in mongodb");
};

// Get user by ID
exports.findUser = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findById(userId, { password: 0, __v: 0 });
      if (!user) throw new Error("Couold not find this user in the database.");

      return Promise.resolve(user);
    } catch (error) {
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get user not in mongodb");
};

// Update user
exports.update = async (userId, normalizedUser) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findByIdAndUpdate(userId, normalizedUser, {
        new: true,
      }).select("-password -__v");
      if (!user) {
        const error = new Error(
          "Could not update this user because a user with this ID cannot be found in the database."
        );
        error.status = 404;
        throw error;
      }
      return Promise.resolve(user);
    } catch (error) {
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("User updated not in mongodb");
};
// Change user isBusiness status
exports.changeIsBizStatus = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error(
          "Could not change user isBusiness status because a user with this ID cannot be found in the database."
        );
        error.status = 404;
        throw error;
      }
      user.isBusiness = !user.isBusiness;
      await user.save();
      // Remove sensitive fields before returning
      const userObj = user.toObject();
      delete userObj.password;
      delete userObj.__v;
      return Promise.resolve(userObj);
    } catch (error) {
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("User Updated not in mongodb!");
};

// Delete user
exports.removeUser = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findByIdAndDelete(userId).select(
        "-password -__v"
      );
      if (!user) {
        const error = new Error(
          "Could not delete this user because a user with this ID cannot be found in the database."
        );
        error.status = 404;
        throw error;
      }
      return Promise.resolve(user);
    } catch (error) {
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("User deleted not in mongodb!");
};
