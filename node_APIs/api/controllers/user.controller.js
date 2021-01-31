const { User, validate } = require("../models/user");
const config = require("./../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function UserController() {
  //API to create user. Validation to check email already exist in database
  this.createUser = async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(config.HTTP_FORBIDDEN).send({
        status: config.ERROR,
        code: config.HTTP_FORBIDDEN,
        error: error.details[0].message,
      });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status: config.ERROR,
        code: config.HTTP_BAD_REQUEST,
        error:
          "User with same email already exisit! Please use different email address.",
      });
    } else {
      bcrypt.hash(req.body.password, config.SALT_ROUND, function (err, hash) {
        if (err) {
          return res.status(config.HTTP_BAD_REQUEST).send({
            status: config.ERROR,
            code: config.HTTP_BAD_REQUEST,
            error: "Unable to save user details!",
          });
        } else {
          user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: hash,
            createdAt: new Date(),
          });
          user.save();
          return res.status(config.HTTP_SUCCESS).send({
            status: config.SUCCESS,
            code: config.HTTP_SUCCESS,
            message: "User added successfully.",
            result: user,
          });
        }
      });
    }
  };

  //Login API to check credentials
  this.login = async (req, res) => {
    let userToLogin = await User.findOne({ email: req.body.email });
    if (userToLogin) {
      bcrypt.compare(
        req.body.password,
        userToLogin.password,
        function (err, response) {
          if (err) {
            return res.status(config.HTTP_FORBIDDEN).send({
              status: config.ERROR,
              code: config.HTTP_FORBIDDEN,
              error: "User does not exist!",
            });
          } else {
            if (response == true) {
              var token = jwt.sign(
                { id: userToLogin._id, role: config.ROLE_ADMIN },
                process.env.SECRET_KEY,
                {
                  expiresIn: process.env.JWT_EXPIRATION_TIME,
                }
              );
              return res.status(config.HTTP_SUCCESS).send({
                status: config.SUCCESS,
                code: config.HTTP_SUCCESS,
                message: "Login Successful!",
                result: { token: token },
              });
            } else {
              return res.status(config.HTTP_NOT_FOUND).send({
                status: config.ERROR,
                code: config.HTTP_NOT_FOUND,
                error: "Please enter valid credentials!",
              });
            }
          }
        }
      );
    } else {
      return res.status(config.HTTP_NOT_FOUND).send({
        status: config.ERROR,
        code: config.HTTP_NOT_FOUND,
        error: "Please enter valid credentials!",
      });
    }
  };
}

module.exports = new UserController();
