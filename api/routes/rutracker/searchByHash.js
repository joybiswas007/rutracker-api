const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const headers = require("../../headers");
const scrapTorrent = require("../../scrapTorrent");

router.post("/", async (req, res) => {
  try {
    const { hash } = req.body;
    const ruTracker = process.env.RUTRACKER;

    const response = await axios.get(
      `${ruTracker}/forum/viewtopic.php?h=${hash}`,
      { ...headers("text/html"), responseType: "arraybuffer" }
    );
    const data = iconv.decode(Buffer.from(response.data), "windows-1251");
    const $ = cheerio.load(data);
    //check if user is searching via names instead of info_hash
    if ($("br").length) {
      return res.status(400).send({ error: "Invalid info hash! Try again." });
    }
    if ($(".mrg_16").length) {
      return res.status(404).send({ error: "No torrent found :(" });
    }
    const topic_id = $("#topic-title").attr("href");
    const torrent = [];
    const torrentDetails = await scrapTorrent(topic_id, $, ruTracker);
    torrent.push(torrentDetails);
    res.status(202).send(torrent);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
