const {
  find,
  findMyCards,
  findOne,
  create,
  update,
  like,
  remove,
  changeBizNumber,
} = require("../models/cardsDataAccessService");
const validateCard = require("../validations/cardValidationService");
const normalizeCard = require("../helpers/normalizeCard");
const { handleJoiError } = require("../../utils/errorHandler");

// Service functions
/// Get all cards
exports.getCards = async () => {
  try {
    const cards = await find();
    return Promise.resolve(cards);
  } catch (error) {
    return Promise.reject(error);
  }
};
/// Get my cards
exports.getMyCards = async (userId) => {
  try {
    const card = await findMyCards(userId);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

/// Get single card by ID
exports.getCard = async (cardId) => {
  try {
    const card = await findOne(cardId);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};
/// Create new card
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

/// Update card
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
/// Like / Unlike card
exports.likeCard = async (cardId, userId) => {
  try {
    const card = await like(cardId, userId);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

//BONUS
// Change card bizNumber - admin only
exports.changeBizNumber = async (cardId, newBizNumber) => {
  try {
    const card = await changeBizNumber(cardId, newBizNumber);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

/// Delete card
exports.deleteCard = async (cardId) => {
  try {
    const card = await remove(cardId);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};
