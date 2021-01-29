const express = require('express');
const router = express.Router();
const validateController = require('./../controllers/ValidationController');

router.get('/', function (req, res) {
    res.send({
        "message": "My Rule-Validation API",
        "status": "success",
        "data": {
            "name": "Ekpono Joseph Ambrose",
            "github": "@ekpono",
            "email": "ekponoambrose@gmail.com",
            "mobile": "08137787345",
            "twitter": "@ekpono11"
        }
    })
});

router.post('/validate-rule', validateController.validation);

module.exports = router;
