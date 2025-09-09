const express = require("express");
const router = express.Router();
const cardsController = require("../cards/routes/cardsRestController");
const usersController = require("../users/routes/usersRestController");
const { handleError } = require("../utils/errorHandler");

router.use("/cards", cardsController);
router.use("/users", usersController);

router.use((req, res) => handleError(res, 404, "Route Not Found."));

module.exports = router;
