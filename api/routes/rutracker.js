const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const headers = require("../headers");
const toEnglish = require("../rus2eng");
const filterTorrents = require("../filterTorrents");

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

    //Check if search result is empty or not
    if ($element.find(".row1").length === 1) {
      return res.status(404).send({ error: "No magnets found :(" });
    }

    let torrents = [];
    for (const torrent of $element.find("tr")) {
      const filename = $(torrent).find("a").eq(1).text().trim();
      const id = $(torrent).find("a").eq(1).attr("href");
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

      /* When searching on rutracker search results also includes torrents which are not *
       * yet moderated and can't ne scraped. So, those results has been exluded from      *
       * scraping.
       */

      if ($topic_page(".mrg_16").length) {
        continue;
      }
      const filesize = $topic_page("#t-tor-stats tr .borderless b")
        .eq(0)
        .text()
        .trim();
      const seeders = $topic_page("#t-tor-stats tr .seed b").text().trim();
      /* 
      If a torrent doesn't have any leechers rutrackers shows "";
      so, instead of "" or displaying the 0 as value. 
      */
      const leechers = $topic_page("#t-tor-stats tr .leech b").text().trim();
      const total_snatches = $topic_page("#t-tor-stats tr .borderless b")
        .eq(2)
        .text()
        .trim();
      const snatches = total_snatches.match(/([\d,]+)/); // Match one or more digits or commas
      const magnet = $topic_page(".magnet-link").attr("href");
      const info_hash = $topic_page(".magnet-link").attr("title");
      const uploaded_date = $topic_page(".attach tbody tr")
        .eq(1)
        .find(".inlined li")
        .eq(0)
        .text()
        .trim();
      torrents.push({
        filename,
        filesize,
        seeders: parseInt(seeders),
        leechers: leechers.length === 0 ? 0 : parseInt(leechers),
        snatches: snatches ? parseInt(snatches[1].replace(/,/g, ""), 10) : 0,
        magnet,
        infohash: info_hash,
        date: toEnglish(uploaded_date),
        topic: topic_id,
      });
    }

    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
