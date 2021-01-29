const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT;
const routes = require("./routes/index");
const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.use((err, req, res, next) => {
  if (err) {
    res.status(400).send({
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null,
    });
  } else {
    next();
  }
});

app.use(routes);

app.listen(PORT, () => {
  console.log("Running Api Validation Rule System on port " + PORT);
});
