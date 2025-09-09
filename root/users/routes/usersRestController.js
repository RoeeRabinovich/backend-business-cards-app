const express = require("express");
const router = express.Router();

const { handleError } = require("../../utils/errorHandler");
const {
  registerUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../services/usersService");
const { changeIsBizStatus } = require("../models/usersDataAccessService");
const { auth } = require("../../auth/authService");

// Routes

// Register a new user
router.post("/", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    const user = await loginUser(req.body);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

// Get all users (admin only)
router.get("/", auth, async (req, res) => {
  try {
    const { isAdmin } = req.user;
    if (!isAdmin) {
      return handleError(res, 403, "Authorization Error: Must be admin!");
    }
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

// Get a specific user by ID (admin or the user themselves)
router.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { _id, isAdmin } = req.user;
    if (_id !== id && !isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: Must be admin or THE registered user!"
      );
    }
    const user = await getUser(id);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

// Update a user (the user themselves)
router.put("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { _id } = req.user;
    if (_id !== id) {
      return handleError(
        res,
        403,
        "Authorization Error: Must be the registered user!"
      );
    }
    const user = await updateUser(id, req.body);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

// Change isBiz status (the user themselves or admin)
router.patch("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { _id, isAdmin } = req.user;
    if (_id !== id && !isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: Must be admin or THE registered user!"
      );
    }
    const user = await changeIsBizStatus(id);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

// Delete a user (the user themselves or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { _id, isAdmin } = req.user;
    if (_id !== id && !isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: Must be admin or THE registered user!"
      );
    }
    const user = await deleteUser(id);
    return res.status(200).json({ message: `Users deleted: ${user}.` });
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

module.exports = router;
