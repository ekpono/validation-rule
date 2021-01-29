const validate = require('../services/validate');
const HttpStatus = require('../helpers/https_status');
const objectValidation = require('../services/objectValidation');
const ruleMap = require('./../helpers/rules');
const httpResponse = require('./../helpers/http_response');
module.exports = {
    async validation(req, res) {
        let requestBody = req.body;
        let { rule, data} =  requestBody;

        let jsonObject = validate.validateJson(requestBody);
        if(jsonObject) {return res.status(HttpStatus.BAD_REQUEST).send({message: jsonObject, status: "error", data: null})}

        //Check if rule is an object
        if(rule.field.toString().indexOf(".") > -1) {
            let ruleField = rule.field;
            let ruleObj = ruleField.split(".");
            let objectFieldExist = objectValidation.validate(rule, data, ruleField, ruleObj);
            if (objectFieldExist) return res.status(HttpStatus.BAD_REQUEST).send({message:objectFieldExist, data: null})

            let value = data[ruleObj[0]][ruleObj[1]];

            let ruleValidation = ruleMap[rule.condition](value, rule.condition_value);

            if (ruleValidation) {
                res.status(HttpStatus.OK).send(httpResponse.successResponse(rule.field, rule.condition_value, rule));
            }
            //That means the object failed validation
            return res.status(HttpStatus.BAD_REQUEST).send(httpResponse.badResponse(rule.field, rule.condition_value, rule));
        }

        //Check if rule field is an array
        let isNumberGiven = rule.field.replace(/[^0-9]/g,'');
        if (isNumberGiven !== null) {
            let value = data[isNumberGiven];
            if (value === undefined) {
                return res.status(400).send({
                    "message": `field ${isNumberGiven} is missing from data.`,
                    "status": "error",
                    "data": null
                })
            }

            let condition_value = rule.condition_value;
            let ruleValidation = ruleMap[rule.condition](value, condition_value);
            if(ruleValidation) {
                return res.status(HttpStatus.OK).send(httpResponse.successResponse(rule.field, condition_value, rule))
            }
            return res.status(HttpStatus.BAD_REQUEST).send(httpResponse.badResponse(rule.field, data, rule ))
        }

        let value = data[rule.field];
        let condition_value = rule.condition_value;

        let keyExist = rule.field in data;
        if (!keyExist) {
            res.status(400).send({
                "message": `${rule.field} is required.`,
                "status": "error",
                "data": null
            })
        }

        if(rule.field in data) {
            let ruleValidation = ruleMap[rule.condition](value, condition_value);

            if(ruleValidation) {
                return res.status(200).send({
                    "message": `field ${rule.field} successfully validated.`,
                    "status": "success",
                    "data": {
                        "validation": {
                            "error": false,
                            "field": rule.field,
                            "field_value": condition_value,
                            "condition": rule.condition,
                            "condition_value": rule.condition_value
                        }
                    }
                })
            }
            return res.status(400).send({
                "message": `field ${rule.field} failed validation.`,
                "status": "error",
                "data": {
                    "validation": {
                        "error": true,
                        "field": rule.field,
                        "field_value": condition_value,
                        "condition": rule.condition,
                        "condition_value": rule.condition_value
                    }
                }
            })
        }
    },
};

