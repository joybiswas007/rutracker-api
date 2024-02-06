const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const headers = require("../handlers/headers");
const filterTorrents = require("../handlers/filterTorrents");
const scrapTorrent = require("../handlers/scrapeTorrent");
const findTorrentsInDB = require("../handlers/findTorrentsInDB");
const logger = require("../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { search } = req.body;
    const { RUTRACKER: ruTracker } = process.env;
    const findTorrents = await findTorrentsInDB(search);
    if (findTorrents.length > 0) {
      return res.status(202).send(findTorrents);
    }
    const response = await axios.post(
      `${ruTracker}/forum/tracker.php?nm=${search}`,
      { nm: search },
      {
        ...headers("application/x-www-form-urlencoded"),
        responseType: "arraybuffer",
      }
    );

    const data = iconv.decode(Buffer.from(response.data), "windows-1251");
    const $ = cheerio.load(data);
    const $element = $("#tor-tbl tbody");

    if ($element.find(".row1").length === 1) {
      return res.status(404).send({ error: "No torrents found :(" });
    }

    const torrents = [];

    for (const torrent of $element.find("tr")) {
      const $torrent = cheerio.load(torrent);
      const id = $torrent("a").eq(1).attr("href");
      const topicId = `${ruTracker}/forum/${id}`;
      const topicResponse = await axios.get(topicId, {
        ...headers("text/html"),
        responseType: "arraybuffer",
      });

      const topicData = iconv.decode(
        Buffer.from(topicResponse.data),
        "windows-1251"
      );
      const topicPage = cheerio.load(topicData);

      if (topicPage(".mrg_16").length) {
        return null;
      }
      const torrentDetails = await scrapTorrent(topicId, topicPage, ruTracker);
      torrents.push(torrentDetails);
    }

    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
