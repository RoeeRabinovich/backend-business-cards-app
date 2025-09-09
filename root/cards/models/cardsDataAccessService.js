const Card = require("../models/mongodb/Card");
const config = require("config");
const { handleBadRequest } = require("../../utils/errorHandler");

const DB = config.get("DB");

const find = async () => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find();
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};
const findMyCards = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const cards = await Card.find({ user_id: userId });
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};

const findOne = async (cardId) => {
  if (DB === "MONGODB") {
    try {
      const card = await Card.findById(cardId);
      if (!card) {
        const error = new Error("Could not find this card in the database.");
        error.status = 404;
        throw error;
      }
      return Promise.resolve(card);
    } catch (error) {
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve({});
};

const create = async (normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      let card = new Card(normalizedCard);
      card = await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }
  return Promise.resolve("create card not in database");
};

const update = async (cardId, normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      let card = await Card.findByIdAndUpdate(cardId, normalizedCard, {
        new: true,
      });
      if (!card) {
        const error = new Error(
          "Could not update this card beacuse a card with this ID cannot be found in the database."
        );
        error.status = 404;
        throw error;
      }
      return Promise.resolve(card);
    } catch (error) {
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card updated not in database");
};

const like = async (cardId, userId) => {
  if (DB === "MONGODB") {
    try {
      const card = await Card.findById(cardId);
      if (!card) {
        const error = new Error(
          "Could not change card likes beacuse a card with this ID cannot be found in the database."
        );
        error.status = 404;
        throw error;
      }
      if (!card.likes.includes(userId)) {
        card.likes.push(userId);
      } else {
        card.likes = card.likes.filter((id) => id !== userId);
      }
      await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card like not in database");
};

const remove = async (cardId) => {
  if (DB === "MONGODB") {
    try {
      const card = await Card.findByIdAndDelete(cardId);
      if (!card) {
        const error = new Error(
          "Could not delete this card beacuse a card with this ID cannot be found in the database."
        );
        error.status = 404;
        throw error;
      }
      return Promise.resolve(card);
    } catch (error) {
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card deleted not in database");
};

module.exports = { find, findMyCards, findOne, create, update, like, remove };
