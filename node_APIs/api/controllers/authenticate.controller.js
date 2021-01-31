const jwt = require("jsonwebtoken");
const config = require("./../../config");

//check if token is valid 
function AuthenticateController() {
  this.isAuthenticated = function (req, res, next) {
    const token = req.body.token;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
          return res.status(config.HTTP_FORBIDDEN).send({
            status: config.ERROR,
            code: config.HTTP_FORBIDDEN,
            error: "Please pass a valid token!",
          });
        } else {
          req.decoded = decoded;
          //Refresh: If the token needs to be refreshed gets the new refreshed token
          let newToken = refreshToken(decoded);
          if (newToken) {
            res.set("token", newToken);
          }
          next();
        }
      });
    } else {
      return res.status(config.HTTP_FORBIDDEN).send({
        status: config.ERROR,
        code: config.HTTP_FORBIDDEN,
        error: "Please pass a valid token!",
      });
    }
  };
}

//Refresh the token
function refreshToken(decoded) {
  let token_exp, now, newToken;

  token_exp = decoded.exp;
  now = (Date.now() / 1000).toFixed();
  if (token_exp - now < process.env.JWT_EXPIRATION_TIME) {
    newToken = createToken(decoded);
    if (newToken) {
      return newToken;
    }
  } else {
    return null;
  }
}

//Create the token 
function createToken(decoded) {
  let data;
  if (decoded.parent_id && decoded.parent_id != undefined) {
    data = { id: decoded.id, parent_id: decoded.parent_id, role: decoded.role };
  } else {
    data = { id: decoded.id, role: decoded.role };
  }
  let token = jwt.sign(data, process.env.SECRET_KEY, {
    expiresIn: config.JWT_EXPIRATION_TIME,
  });
  return token;
}

module.exports = new AuthenticateController();
