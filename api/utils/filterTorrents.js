const { Search } = require("../db/dbSchema");

// Filter dead torrents and exclude them in results and save in DB
// If data is already present in db then don't save it update few fields just return the result

const filterTorrents = (res, pageCount, timeTaken, torrents) => {
  const filteredTorrents = torrents.filter((torrent) => torrent.seeders !== 0);
  if (filteredTorrents.length > 0) {
    filteredTorrents.map(async (search) => {
      const {
        filename,
        filesize,
        seeders,
        leechers,
        snatches,
        magnet,
        infohash,
        date,
        topicId,
        downloadId,
      } = search;
      const existingRecord = await Search.findOne({
        topicId,
        downloadId,
      });
      if (!existingRecord) {
        const data = new Search({
          filename,
          filesize,
          seeders,
          leechers,
          snatches,
          magnet,
          infohash,
          uploadedDate: date,
          topicId,
          downloadId,
        });
        await data.save();
      } else {
        const updateFields = {};
        if (existingRecord.seeders !== seeders) {
          updateFields.seeders = seeders;
        }
        if (existingRecord.leechers !== leechers) {
          updateFields.leechers = leechers;
        }
        if (existingRecord.snatches !== snatches) {
          updateFields.snatches = snatches;
        }
        if (Object.keys(updateFields).length > 0) {
          await Search.updateOne(
            { _id: existingRecord._id },
            { $set: updateFields }
          );
        }
      }
    });
    res.status(200).send({
      statusCode: 200,
      pages: pageCount,
      timeTaken: `${timeTaken} ms`,
      torrents: filteredTorrents,
    });
  } else {
    res.status(404).send({ statusCode: 404, error: "No magnets found :(" });
  }
};

module.exports = filterTorrents;
