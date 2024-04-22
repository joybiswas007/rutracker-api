const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const headers = require("../utils/headers");
const filterTorrents = require("../utils/filterTorrents");
const scrapTorrent = require("../utils/scrapeTorrent");
const logger = require("../configs/logger");

router.post("/", async (req, res) => {
  try {
    const startTime = new Date();
    const { search } = req.body;
    const { RUTRACKER: ruTracker } = process.env;
    const response = await axios.post(
      "https://rutracker.org/forum/tracker.php",
      new URLSearchParams({
        max: "1",
        nm: search,
      }),
      {
        params: {
          nm: search,
        },
        headers,
        responseType: "arraybuffer",
      }
    );

    const data = iconv.decode(Buffer.from(response.data), "windows-1251");
    const $ = cheerio.load(data);
    let pageCount = 1;
    const totalPagesElement = $(".bottom_info .nav p")
      .eq(0)
      .find("b")
      .eq(1)
      .text()
      .trim();
    if (totalPagesElement) {
      pageCount = parseInt(totalPagesElement, 10);
    }

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
        headers,
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
      const torrentDetails = await scrapTorrent(topicId, topicPage);
      torrents.push(torrentDetails);
    }

    const endTime = new Date();
    // Time taken in milliseconds
    const timeTaken = endTime - startTime;

    filterTorrents(res, pageCount, timeTaken, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ statusCode: 500, error: error.message });
  }
});

module.exports = router;
