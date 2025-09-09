const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose
  .connect("mongodb://localhost:27017/business_card_app")
  .then(() => console.log(chalk.magentaBright("Connect Locally To MongoDB!")))
  .catch((error) => {
    console.log(chalk.redBright(error));
  });
