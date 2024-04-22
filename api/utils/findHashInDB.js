const { Search } = require("../db/dbSchema");

const findHashInDB = async (hash) => {
  const search = await Search.findOne({ infohash: hash }).select(
    "_id filename filesize seeders leechers snatches magnet infohash uploadedDate topicId downloadId"
  );
  return search;
};

module.exports = findHashInDB;
