const { verifyToken } = require("./Providers/jwt");
const { handleError } = require("../utils/errorHandler");
const config = require("config");
const tokenGenerator = config.get("TOKEN_GENERATOR") || "jwt";

const auth = (req, res, next) => {
  if (tokenGenerator === "jwt") {
    try {
      let tokenFromClient = req.header("x-auth-token");

      if (!tokenFromClient) {
        return handleError(
          res,
          401,
          "Authentication Error: Please Login/Authenticate."
        );
      }

      const userData = verifyToken(tokenFromClient);
      if (!userData) {
        return handleError(
          res,
          401,
          "Authentication Error: Unauthorized User."
        );
      }
      req.user = userData;
      return next();
    } catch (error) {
      return handleError(res, 401, error.message);
    }
  }
  return handleError(res, 500, "Use jwt!");
};

exports.auth = auth;
