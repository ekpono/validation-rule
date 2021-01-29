module.exports = {
  contains: (value, condition) => value.indexOf(condition) === 0,
  gte: (value, condition) => value >= condition,
  lte: (value, condition) => value <= condition,
  eq: (value, condition) => value === condition,
  neq: (value, condition) => value !== condition,
  gt: (value, condition) => value > condition,
  lt: (value, condition) => value < condition,
};
