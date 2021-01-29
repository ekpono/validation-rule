module.exports = {
    validateJson(requestBody) {
        if (! requestBody.hasOwnProperty('rule')) {
            return "rule is required.";
        }
        if (! requestBody.hasOwnProperty('data')) {
            return "data is required.";
        }
        if (typeof requestBody !== "object") {
            return "Invalid JSON payload passed."
        }

        if(typeof requestBody.data !== "object" &&  typeof requestBody.data !== "string") {
            return  "data should be an object or string."
        }

        if (typeof requestBody.rule !== "object") {
            return "rule should be an object.";
        }
        if(! requestBody.rule.hasOwnProperty('field') || ! requestBody.rule.hasOwnProperty('condition') || ! requestBody.rule.hasOwnProperty('condition_value')) {
            return "keys field, condition, condition_value must be included in rule."
        }

        if (typeof requestBody.rule.field !== "string" ) {
            return `${Object.keys(requestBody.rule)[0]} should be a string.`;
        }

        if (typeof requestBody.rule.condition !== "string" ) {
            return `${Object.keys(requestBody.rule)[1]} should be a string.`;
        }

        if (typeof requestBody.rule.condition_value === "object") {
            return `${Object.keys(requestBody.rule)[2]} should be a string or a number.`;
        }

    },
};