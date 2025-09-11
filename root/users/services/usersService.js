const {
  createUser,
  login,
  findUsers,
  findUser,
  update,
  changeIsBizStatus,
  removeUser,
} = require("../models/usersDataAccessService");
const {
  validateRegistration,
  validateLogin,
  validateUserUpdate,
} = require("../validations/userValidationService");
const normalizeUser = require("../helpers/normalizeUser");
const { generateUserPassword } = require("../helpers/bcrypt");
const { handleJoiError } = require("../../utils/errorHandler");

// Service functions
// Get all users
const getUsers = async () => {
  try {
    const users = await findUsers();
    return Promise.resolve(users);
  } catch (error) {
    return Promise.reject(error);
  }
};
// Get user by ID
const getUser = async (userId) => {
  try {
    const user = await findUser(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};
// Register new user
const registerUser = async (rawUser) => {
  try {
    const { error } = validateRegistration(rawUser);
    if (error) {
      return Promise.reject(await handleJoiError(error));
    }

    let user = normalizeUser(rawUser);
    user.password = generateUserPassword(user.password);
    user = await createUser(user);

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};
// Login user
const loginUser = async (rawUser) => {
  try {
    const { error } = validateLogin(rawUser);
    if (error) {
      return Promise.reject(await handleJoiError(error));
    }
    let user = { ...rawUser };
    user = await login(user);

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};
// Update user
const updateUser = async (userId, rawUser) => {
  try {
    const { error } = validateUserUpdate(rawUser);
    if (error) {
      return Promise.reject(await handleJoiError(error));
    }
    let user = normalizeUser(rawUser);
    user = await update(userId, user);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};
// Delete user
const deleteUser = async (userId) => {
  try {
    const user = await removeUser(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Change user's business status
const changeUserBizStatus = async (userId) => {
  try {
    const user = await changeIsBizStatus(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
  changeUserBizStatus,
};
