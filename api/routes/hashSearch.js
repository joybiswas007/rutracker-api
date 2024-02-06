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
    const { hash } = req.body;
    const { RUTRACKER: ruTracker } = process.env;
    const hashInDB = await findHashInDB(hash);
    // If hash available in DB then return the result
    if (hashInDB) {
      return res.status(202).send(hashInDB);
    }
    const response = await axios.get(
      `${ruTracker}/forum/viewtopic.php?h=${hash}`,
      { ...headers("text/html"), responseType: "arraybuffer" }
    );
    const data = iconv.decode(Buffer.from(response.data), "windows-1251");
    const $ = cheerio.load(data);
    if ($(".mrg_16").length) {
      return res.status(404).send({ error: "No torrent found :(" });
    }
    const topicId = $("#topic-title").attr("href");
    const torrent = [];
    const torrentDetails = await scrapTorrent(topicId, $, ruTracker);
    torrent.push(torrentDetails);
    if (torrent[0].downloadId === "https://rutracker.org/forum/undefined") {
      return res
        .status(400)
        .send({ error: "Invalid info hash type! Try again." });
    }
    res.status(202).send(torrent);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
