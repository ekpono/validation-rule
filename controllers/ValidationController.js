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

        //NESTED OBJECT
        //Check if rule has a dot thus taking it an object
        if(rule.field.toString().indexOf(".") > -1) {
            let ruleField = rule.field;
            let ruleObj = ruleField.split(".");
            let objectFieldExist = objectValidation.validate(rule, data, ruleField, ruleObj);
            if (objectFieldExist) return res.status(HttpStatus.BAD_REQUEST).send({message:objectFieldExist, data: null})

            let value = data[ruleObj[0]][ruleObj[1]];

            let ruleValidated = ruleMap[rule.condition](value, rule.condition_value);

            if (ruleValidated) {
                res.status(HttpStatus.OK).send(httpResponse.successResponse(rule.field, rule.condition_value, rule));
            }
            //That means the object failed validation
            return res.status(HttpStatus.BAD_REQUEST).send(httpResponse.invalidationFailedResponse(rule.field, rule.condition_value, rule));
        }

        // ARRAY VIA INDEX
        //Check if rule field has a number. Number is seen as an array index
        let isNumberGiven = rule.field.replace(/[^0-9]/g,'');
        if (isNumberGiven) {

            //Check if data is string
            if(typeof data === "string") {
                let stringDataToArray = data.split('');
                let value = stringDataToArray[isNumberGiven];
                let condition_value = rule.condition_value;
                let ruleValidated = ruleMap[rule.condition](value, condition_value);
                if(ruleValidated) {
                    return res.status(HttpStatus.OK).send(httpResponse.successResponse(rule.field, value, rule))
                }
                return res.status(HttpStatus.BAD_REQUEST).send(httpResponse.invalidationFailedResponse(rule.field, value, rule ))
            }

            if (typeof data === "object") {
                // Check if data is an array
                let value = data[isNumberGiven];
                let condition_value = rule.condition_value;
                let ruleValidation = ruleMap[rule.condition](value, condition_value);
                if(ruleValidation) {
                    return res.status(HttpStatus.OK).send(httpResponse.successResponse(rule.field, condition_value, rule))
                }
                return res.status(HttpStatus.BAD_REQUEST).send(httpResponse.invalidationFailedResponse(rule.field, data, rule ))
            }
        }

        // NATIVE OBJECT
        let value = data[rule.field];
        let condition_value = rule.condition_value;

        let keyExist = rule.field in data;
        if (!keyExist) {
            return res.status(400).send({
                "message": `${rule.field} is required.`,
                "status": "error",
                "data": null
            })
        }

        if(rule.field in data) {
            let ruleValidation = ruleMap[rule.condition](value, condition_value);

            if(ruleValidation) {
                return res.status(HttpStatus.OK).send(httpResponse.successResponse(rule.field, condition_value, rule))
            }
            return res.status(HttpStatus.BAD_REQUEST).send(httpResponse.invalidationFailedResponse(rule.field, data, rule))
        }
    },
};

