// Check if torrent already exist on db or not

const { Search } = require("../db/dbSchema");

const findTorrentsInDB = async (search) => {
  const torrent = await Search.find({
    filename: {
      $regex: search,
      $options: "i",
    },
  }).select(
    "_id filename filesize seeders leechers snatches magnet infohash uploadedDate topicId downloadId"
  );
  return torrent;
};

module.exports = findTorrentsInDB;
