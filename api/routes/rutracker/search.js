const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const headers = require("../../headers");
const filterTorrents = require("../../filterTorrents");
const scrapTorrent = require("../../scrapTorrent");

router.post("/", async (req, res) => {
  try {
    const { search } = req.body;
    const ruTracker = process.env.RUTRACKER;

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
      return res.status(404).send({ error: "No magnets found :(" });
    }

    const torrents = [];

    for (const torrent of $element.find("tr")) {
      const $torrent = cheerio.load(torrent);
      const id = $torrent("a").eq(1).attr("href");
      const topic_id = `${ruTracker}/forum/${id}`;
      const topic_response = await axios.get(topic_id, {
        ...headers("text/html"),
        responseType: "arraybuffer",
      });

      const topic_data = iconv.decode(
        Buffer.from(topic_response.data),
        "windows-1251"
      );
      const $topic_page = cheerio.load(topic_data);

      if ($topic_page(".mrg_16").length) {
        return null;
      }
      const torrentDetails = await scrapTorrent(
        topic_id,
        $topic_page,
        ruTracker
      );
      torrents.push(torrentDetails);
    }

    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
