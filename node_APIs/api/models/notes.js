const Joi = require("joi");
const mongoose = require("mongoose");

const Notes = mongoose.model(
  "Notes",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 5000,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
  })
);

function validateNotes(notes) {
  const schema = Joi.object({
    id: Joi.string().allow(null),
    name: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(1).max(5000).required(),
    token: Joi.string()
      .regex(/^[A-zÀ-ɏ0-9\.\-\_\,]*$/)
      .rule({ message: "Please pass a valid token." })
      .required(),
  });
  return schema.validate(notes);
}

function validationForId(notes) {
  const schema = Joi.object({
    id: Joi.string().required(),
    token: Joi.string()
      .regex(/^[A-zÀ-ɏ0-9\.\-\_\,]*$/)
      .rule({ message: "Please pass a valid token." })
      .required(),
  });
  return schema.validate(notes);
}

exports.Notes = Notes;
exports.validate = validateNotes;
exports.validationForId = validationForId;
