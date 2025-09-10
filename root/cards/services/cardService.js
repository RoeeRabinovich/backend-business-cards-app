const {
  find,
  findMyCards,
  findOne,
  create,
  update,
  like,
  remove,
} = require("../models/cardsDataAccessService");
const validateCard = require("../validations/cardValidationService");
const normalizeCard = require("../helpers/normalizeCard");
const { handleJoiError } = require("../../utils/errorHandler");

exports.getCards = async () => {
  try {
    const cards = await find();
    return Promise.resolve(cards);
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.getMyCards = async (userid) => {
  try {
    const card = await findMyCards(userid);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};
exports.getCard = async (cardId) => {
  try {
    const card = await findOne(cardId);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};
exports.createCard = async (rawCard, userId) => {
  try {
    const { error } = validateCard(rawCard);
    if (error) {
      return Promise.reject(await handleJoiError(error));
    }
    let card = await normalizeCard(rawCard, userId);
    card = await create(card);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.updateCard = async (cardId, rawCard) => {
  try {
    const { error } = validateCard(rawCard);
    if (error) {
      return Promise.reject(await handleJoiError(error));
    }
    const card = await update(cardId, rawCard);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.likeCard = async (cardId, userId) => {
  try {
    const card = await like(cardId, userId);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.deleteCard = async (cardId) => {
  try {
    const card = await remove(cardId);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};
