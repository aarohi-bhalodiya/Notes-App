require("dotenv").config();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const app = express();
const routes = require("./routes");

mongoose
  .connect("mongodb://localhost/notes-app")
  .then(() => {
    console.log("Now connected to MongoDB!");
    routes.configure(app, router);
  })
  .catch((err) => console.error("Something went wrong", err));

app.use(express.json());

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
