const express = require('express');
const router = express.Router();

module.exports = {
    validation(req, res) {
        // const { rule } = req.body;
        console.log(req.body.rule.field)
        res.send({
            'message': 'Here we go'
        })
    }
};

