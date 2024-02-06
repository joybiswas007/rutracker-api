const { Search } = require("../db/dbSchema");

const findHashInDB = async (hash) => {
  const search = await Search.findOne({ infohash: hash });
  return search;
};

module.exports = findHashInDB;
