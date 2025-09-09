const mongoose = require("mongoose");
const chalk = require("chalk");

const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri)
  .then(() => console.log(chalk.magentaBright("Connect to atlas MongoDb")))
  .catch((error) => {
    console.log(chalk.redBright(error));
  });
