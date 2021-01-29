module.exports = {
  validate(rule, data, ruleField, ruleObj) {
    let firstObjKeyExist = ruleObj[0] in data;
    if (!firstObjKeyExist) return `${ruleField} is required.`;

    let secondObjKeyExist = ruleObj[1] in data[ruleObj[0]];

    if (!firstObjKeyExist || !secondObjKeyExist) {
      return `${ruleField} is required.`;
    }
  },
};
