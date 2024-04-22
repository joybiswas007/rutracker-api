const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const headers = require("../utils/headers");
const scrapTorrent = require("../utils/scrapeTorrent");
const findHashInDB = require("../utils/findHashInDB");
const logger = require("../configs/logger");

router.post("/", async (req, res) => {
  try {
    const startTime = new Date();
    const { hash } = req.body;
    const { RUTRACKER: ruTracker } = process.env;
    const hashInDB = await findHashInDB(hash);
    // If hash available in DB then return the result
    if (hashInDB) {
      const endTime = new Date();
      const timeTaken = endTime - startTime;
      return res.status(200).send({
        statusCode: 200,
        timeTaken: `${timeTaken} ms`,
        torrent: hashInDB,
      });
    }
    const response = await axios.get(
      `${ruTracker}/forum/viewtopic.php?h=${hash}`,
      { headers, responseType: "arraybuffer" }
    );
    const data = iconv.decode(Buffer.from(response.data), "windows-1251");
    const $ = cheerio.load(data);
    if ($(".mrg_16").length) {
      return res.status(404).send({ error: "No torrent found :(" });
    }
    const topicId = $("#topic-title").attr("href");
    const torrent = [];
    const torrentDetails = await scrapTorrent(topicId, $);
    torrent.push(torrentDetails);
    if (torrent[0].downloadId === "https://rutracker.org/forum/undefined") {
      return res
        .status(400)
        .send({ error: "Invalid info hash type! Try again." });
    }
    const endTime = new Date();
    // Time taken in milliseconds
    const timeTaken = endTime - startTime;
    res.status(200).send({
      statusCode: 200,
      timeTaken: `${timeTaken} ms`,
      torrent,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ statusCode: 500, error: error.message });
  }
});

module.exports = router;
