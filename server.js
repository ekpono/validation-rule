const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const {PORT} = require('./config');
const routes = require('./routes/index');
const app = express();

app.use(bodyParser.json());

app.use(routes);

app.listen(PORT, () => {
    console.log("Running Api Validation Rule System on port " + PORT);
});
