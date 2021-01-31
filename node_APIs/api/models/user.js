const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    userName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100
    },
    createdAt: {
        type: Date,
        required: true
    }
  })
);

function validateUser(user) {
  const schema = Joi.object({
    id: Joi.string().allow(null),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    userName: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().min(1).max(100).required()
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;