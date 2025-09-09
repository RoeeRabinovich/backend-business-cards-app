const validateCardwithJoi = require("./Joi/validateCardWithJoi");

const validator = undefined || "Joi";

const validateCard = (card) => {
  if (validator == "Joi") {
    return validateCardwithJoi(card);
  }
};

module.exports = validateCard;
