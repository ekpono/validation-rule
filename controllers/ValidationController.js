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

            //Make sure the object key exist if not throw an error
            let secondLevelObject = data[ruleObj[0]];
            if(ruleObj.length > 2 && typeof secondLevelObject[ruleObj[1]] === "object") {
                return res.status(HttpStatus.BAD_REQUEST).send({message: "The nesting should not be more than two levels", status: "error", data: null})
            }

            //Ensure the data field exists in data
            let nestedObjectFieldExist = objectValidation.validate(rule, data, ruleField, ruleObj);
            if (nestedObjectFieldExist) return res.status(HttpStatus.BAD_REQUEST).send({message:nestedObjectFieldExist, status: "error",  data: null, })

            let value = data[ruleObj[0]][ruleObj[1]];

            let ruleValidated = ruleMap[rule.condition](value, rule.condition_value);

            if (ruleValidated) {
                return res.status(HttpStatus.OK).send(httpResponse.successResponse(rule.field, rule.condition_value, rule));
            }
            //That means the object failed validation
            return res.status(HttpStatus.BAD_REQUEST).send(httpResponse.invalidationFailedResponse(rule.field, rule.condition_value, rule));
        }

        // ARRAY VIA INDEX
        //Check if rule field has a number. Number is seen as an array index
        let isNumberGiven = rule.field.replace(/[^0-9]/g,'');
        if (isNumberGiven) {
            //Check if data is a string
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

            // Check if data is an object or array
            if (typeof data === "object") {
                let value = data[isNumberGiven];

                if (value === undefined) {
                    return res.status(HttpStatus.BAD_REQUEST).send({message: `field ${isNumberGiven} is missing from data`, status: "error", data: null})
                }
                let condition_value = rule.condition_value;
                let ruleValidation = ruleMap[rule.condition](value, condition_value);
                if(ruleValidation) {
                    return res.status(HttpStatus.OK).send(httpResponse.successResponse(rule.field, condition_value, rule))
                }
                return res.status(HttpStatus.BAD_REQUEST).send(httpResponse.invalidationFailedResponse(rule.field, rule.condition_value, rule ))
            }
        }

        // NATIVE OBJECT
        let value = data[rule.field];
        let condition_value = rule.condition_value;

        let keyExist = rule.field in data;
        if (!keyExist) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                "message": `field ${rule.field} is missing from the data.`,
                "status": "error",
                "data": null
            })
        }

        if(rule.field in data) {
            let ruleValidation = ruleMap[rule.condition](value, condition_value);

            if(ruleValidation) {
                return res.status(HttpStatus.OK).send(httpResponse.successResponse(rule.field, value, rule))
            }
            return res.status(HttpStatus.BAD_REQUEST).send(httpResponse.invalidationFailedResponse(rule.field, value, rule))
        }
    },
};

