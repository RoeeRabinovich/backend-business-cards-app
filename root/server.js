require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./router/router");
const cors = require("./middlewares/cors");
const chalk = require("chalk");
const logger = require("./logger/loggerService");
const { handleError } = require("./utils/errorHandler");
const connectToDb = require("./DB/dbService");
const config = require("config");
const {
  generateInitialCards,
  generateInitialUsers,
} = require("./initialData/initialDataService");

// Middleware - Appl Level
app.use(cors);
app.use(logger);
app.use(express.json());
app.use(express.text());
app.use(express.static("./public"));
app.use(router);

// Error Handler Middleware
app.use((err, req, res, next) => {
  handleError(res, err.status || 500, err.message);
});

const PORT = config.get("PORT");
app.listen(PORT, () => {
  console.log(chalk.bgBlueBright(`INIT SERVER ON: www.localhost:${PORT}`));
  connectToDb();
  generateInitialCards();
  generateInitialUsers();
});
