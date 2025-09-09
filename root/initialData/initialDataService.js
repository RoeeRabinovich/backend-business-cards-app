const data = require("./initialData.json");
const normalizeUser = require("../users/helpers/normalizeUser");
const normalizeCard = require("../cards/helpers/normalizeCard");
const { createUser } = require("../users/models/usersDataAccessService");
const { create } = require("../cards/models/cardsDataAccessService");
const { generateUserPassword } = require("../users/helpers/bcrypt");
const chalk = require("chalk");

const generateInitialCards = async () => {
  const { cards } = data;
  cards.forEach(async (card) => {
    try {
      const userId = "6376274068d78742d84f31d2";
      card = await normalizeCard(card, userId);
      await create(card);
      return;
    } catch (error) {
      return console.log(chalk.redBright(error.message));
    }
  });
};

const generateInitialUsers = async () => {
  const { users } = data;
  users.forEach(async (user) => {
    try {
      user = await normalizeUser(user);
      user.password = generateUserPassword(user.password);
      await createUser(user);
      return;
    } catch (error) {
      return console.log(chalk.redBright(error.message));
    }
  });
};

module.exports = { generateInitialCards, generateInitialUsers };
