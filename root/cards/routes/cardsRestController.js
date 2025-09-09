const express = require("express");
const { handleError } = require("../../utils/errorHandler");
const {
  getCards,
  getCard,
  createCard,
  getMyCards,
  updateCard,
  likeCard,
  deleteCard,
} = require("../services/cardService");
const router = express.Router();
const { auth } = require("../../auth/authService");

router.get("/", async (req, res) => {
  try {
    const cards = await getCards(req.body);
    return res.status(200).json(cards);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const { _id } = req.user;

    const cards = await getMyCards(_id);
    return res.status(200).json(cards);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const card = await getCard(id);
    return res.status(200).json(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { isBusiness } = req.user;
    if (!isBusiness) {
      return handleError(
        res,
        403,
        "Authorization Error: Must be business acount!"
      );
    }
    const card = await createCard(req.body);
    return res.status(201).json(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;

    // get the card to check ownership
    const card = await getCard(id);
    if (!card) {
      return handleError(res, 404, "Card not found");
    }
    if (String(card.user_id) !== String(_id)) {
      return handleError(
        res,
        403,
        "Authorization Error: Only the card creator can edit this card!"
      );
    }

    const updatedCard = await updateCard(id, req.body);
    return res.status(200).json(updatedCard);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;

    if (!_id) {
      return handleError(res, 403, "Authorization Error: Must Login.");
    }
    const card = await likeCard(id, _id);

    if (!card) {
      return handleError(res, 404, "Card not found");
    }
    return res.status(200).json(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isAdmin } = req.user;

    // Fetch the card to check ownership
    const card = await getCard(id);
    if (!card) {
      return handleError(res, 404, "Card not found");
    }
    if (String(card.user_id) !== String(_id) && !isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: Only the card creator or an admin can delete this card!"
      );
    }

    const deletedCard = await deleteCard(id);
    return res.status(200).json(deletedCard);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

module.exports = router;
