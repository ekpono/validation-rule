const express = require('express');
const bodyParser = require('body-parser');

/**
     eq: Means the field value should be equal to the condition value
     neq: Means the field value should not be equal to the condition value
     gt: Means the field value should be greater than the condition value
     gte: Means the field value should be greater than or equal to the condition value
     contains: Means the field value should contain the condition value
 */
module.exports = {
    async validation(req, res) {
        let requestBody = req.body;
        let { rule, data} =  req.body;

        //Is rule passed as a key?
        if (! requestBody.hasOwnProperty('rule')) {
            res.send({
                "message": "rule is required.",
                "status": "error",
                "data": null
            }, 400)
        }


        //Is data passed as a key?
        if (! requestBody.hasOwnProperty('data')) {
            res.send({
                "message": "data is required.",
                "status": "error",
                "data": null
            }, 400)
        }

        //Is the right JSON passed
        if (typeof requestBody !== "object") {
            res.send({
                "message": "Invalid JSON payload passed.",
                "status": "error",
                "data": null
            })
        }

        //Todo Check if this keymap exist in rule condition
        let rule_map = {
            contains: (value, condition) => value.indexOf(condition) === 0,
            gte: (value, condition) => value >= condition,
            lte: (value, condition) => value <= condition,
            eq: (value, condition) => value === condition,
            neq: (value, condition) => value !== condition,
            gt: (value, condition) => value > condition
        };


        //Check if rule is an object
        if(rule.field.toString().indexOf(".") > -1) {
            let ruleField =  rule.field;
            let ruleObj = ruleField.split(".");

            let firstObjKeyExist = ruleObj[0] in data;

            if (! firstObjKeyExist) {
                return res.send({
                    "message": `${ruleField} is required.`,
                    "status": "error",
                    "data": null
                })
            }

            let secondObjKeyExist = ruleObj[1] in data[ruleObj[0]];


            //Key does not exist
            if (! firstObjKeyExist || ! secondObjKeyExist) {
                return res.status(400).send({
                    "message": `${ruleField} is required.`,
                    "status": "error",
                    "data": null
                })
            }

            //Both keys exist so you can assign
            let value = data[ruleObj[0]][ruleObj[1]];


            let condition_value = rule.condition_value;
            let ruleValidation = rule_map[rule.condition](value, condition_value);
            if (ruleValidation) {
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

            //That means the object failed validation
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

        //Check if array index is given
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
            let ruleValidation = rule_map[rule.condition](value, condition_value);
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
            let ruleValidation = rule_map[rule.condition](value, condition_value);

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

