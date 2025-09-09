const Joi = require("joi");

const loginValidation = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .ruleset.regex(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({ message: "card email must be valid mail" })
      .required(),
    password: Joi.string()
      .ruleset.regex(passwordRegex)
      .rule({
        message:
          "Password must contain at least 9 characters, one uppercase and one lowercase letter,a number, and one of the following: !@#$%&^",
      })
      .required(),
  });
  return schema.validate(user);
};

module.exports = loginValidation;
