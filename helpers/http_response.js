module.exports = {
    badResponse(fieldName, fieldValue, rule) {
        return {
            "message": `field ${fieldName} failed validation.`,
            "status": "error",
            "data": {
                "validation": {
                    "error": true,
                    "field": fieldName,
                    "field_value": fieldValue,
                    "condition": rule.condition,
                    "condition_value": rule.condition_value
                }
            }
        }
    },

    successResponse(fieldName, fieldValue, rule) {
        return {
            "message": `field ${fieldName} successfully validated.`,
            "status": "success",
            "data": {
                "validation": {
                    "error": false,
                    "field": fieldValue,
                    "field_value": fieldValue,
                    "condition": rule.condition,
                    "condition_value": rule.condition_value
                }
            }
        }
    }
};
